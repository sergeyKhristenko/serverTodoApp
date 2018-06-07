const mongoose = require('mongoose');
const Note = require('../models/Note');
const User = require('../models/User');
const { db } = require('./config.json');

exports.setUpConnection = function() {
  mongoose.connect(`mongodb://${db.host}/${db.name}`);
};

exports.listNotes = function() {
  return Note.find();
};

exports.createNote = function(data) {
  const note = new Note({
    title: data.title,
    text: data.text,
    color: data.color,
    createAt: new Date()
  });

  return note.save();
};

exports.deleteNote = function(id) {
  return Note.findById(id).remove();
};

exports.createUser = function(creds) {
  const user = new User(({ email, password } = creds));

  return user.save();
};
