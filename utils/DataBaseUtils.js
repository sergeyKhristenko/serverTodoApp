const mongoose = require('mongoose');

const { db } = require('./config.json');

const Note = require('../models/Note');
const User = require('../models/User');
const Board = require('../models/Board').Board;
const Column = require('../models/Board').Column;

const Schema = mongoose.Schema;

exports.setUpConnection = function() {
  mongoose.connect(`mongodb://${db.host}/${db.name}`);
};

// TODO only for testing. Remove when ready
exports.listNotes = function() {
  return Note.find();
};

exports.listBoards = function(token) {
  return Board.find({
    users: token
  });
};

exports.getBoard = function(boardId) {
  return Board.findById(boardId)
    .populate('columns')
    .populate({
      path: 'columns',
      populate: { path: 'cards' }
    });
};

exports.createBoard = function(data) {
  const board = new Board({
    name: data.name,
    users: [data.userId]
  });

  return board.save();
};

exports.createColumn = async function(data) {
  const column = new Column({
    name: data.name
  });

  const savedColumn = await column.save();
  const board = await Board.findById(data.boardId);
  board.columns.push(column);
  await board.save();

  return savedColumn;
};

exports.updateBoard = function(userId, boardId, data) {
  return Board.findOne({
    users: userId,
    _id: boardId
  }).then(board => {
    if (board) {
      board.set({ ...data });

      return board.save();
    }
  });
};

exports.updateColumn = async function(columnId, data) {
  const column = await Column.findById(columnId);

  if (data.order !== undefined) {
    const board = await Board.findOne({ columns: columnId });

    const oldOrder = board.columns.indexOf(columnId);

    if (data.order !== oldOrder) {
      const newOrder = data.order;

      // move element to new position
      board.columns.splice(newOrder, 0, board.columns.splice(oldOrder, 1)[0]);

      await board.save();
    }
  }

  const { order, ...dataToSave } = data;
  column.set(dataToSave);

  return column.save();
};

exports.createNote = async function(data) {
  const note = new Note({
    title: data.title,
    text: data.text,
    color: data.color,
    createAt: new Date()
  });

  const savedNote = await note.save();
  const column = await Column.findById(data.columnId);
  column.cards.push(note);
  await column.save();

  return savedNote;
};

exports.deleteNote = async function(id) {
  const note = await Note.findById(id);
  
  return note.remove();
};

exports.updateNote = async function(id, data) {
  if (data.order !== undefined) {
    const column = await Column.findOne({ cards: id });
    const oldOrder = column.cards.indexOf(id);

    if (data.order !== oldOrder) {
      const newOrder = data.order;

      // move element to new position
      column.cards.splice(newOrder, 0, column.cards.splice(oldOrder, 1)[0]);

      await column.save();
    }
  }

  const { order, ...dataToUpdate } = data;

  return Note.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true }, function(err, note) {
    if (err) return console.error(err);

    return note;
  });
};

exports.createUser = function(creds) {
  const user = new User(({ email, password } = creds));

  return user.save();
};
