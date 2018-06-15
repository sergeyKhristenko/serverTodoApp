const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = new Schema({
  title: { type: String },
  text: { type: String, required: true },
  color: { type: String },
  order: { type: Number },
  createdAt: { type: Date }
});

CardSchema.pre('remove', function(next) {
  const card = this;
  card.model('Column').update({ cards: card._id }, { $pull: { cards: card._id } }, { multi: true }, next);
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;
