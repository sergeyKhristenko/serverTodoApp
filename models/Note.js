const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: { type: String },
  text: { type: String, required: true },
  color: { type: String },
  order: { type: Number },
  createdAt: { type: Date }
});

NoteSchema.pre('remove', function(next) {
  const note = this;
  note.model('Column').update({ cards: note._id }, { $pull: { cards: note._id } }, { multi: true }, next);
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
