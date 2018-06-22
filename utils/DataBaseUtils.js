const mongoose = require('mongoose');

const { db } = require('./config.json');

const Card = require('../models/Card');
const Board = require('../models/Board').Board;
const Column = require('../models/Board').Column;

exports.setUpConnection = function() {
  mongoose.connect(`mongodb://${db.host}/${db.name}`);
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

exports.updateCard = async function(id, data) {
  const card = await Card.findById(id);

  if(data.columnId !== undefined && card.columnId !== data.columnId) {
    const oldColumn = await Column.findById(card.columnId);
    oldColumn.cards.pull(card);
    await oldColumn.save();

    const newColumn = await Column.findById(data.columnId);
    newColumn.cards.push(card);
    await newColumn.save();
  }

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

  return Card.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true }, function(err, card) {
    if (err) return console.error(err);

    return card;
  });
};
