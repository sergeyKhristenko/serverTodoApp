const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ColumnSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  cards: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});

const BoardSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  columns: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Board = mongoose.model('Board', BoardSchema);
const Column = mongoose.model('Column', ColumnSchema);

exports.Column = Column;
exports.Board = Board;
