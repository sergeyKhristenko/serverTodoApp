const express = require('express');
const router = express.Router();

const Card = require('../models/Card');
const Column = require('../models/Board').Column;

const db = require('../utils/DataBaseUtils');

// TODO only for testing. Remove when ready
router.get('/', (req, res) => {
  Card.find().then(cards => res.send(cards));
});

router.post('/', async (req, res) => {
  const body = req.body;
  const card = new Card({
    title: body.title,
    text: body.text,
    color: body.color,
    createAt: new Date(),
    columnId: body.columnId
  });

  const savedCard = await card.save();
  const column = await Column.findById(body.columnId);
  column.cards.push(card);
  await column.save();

  res.send(savedCard);
});

router.put('/:id', (req, res) => {
  db.updateCard(req.params.id, req.body).then(updateCard => res.send(updateCard));
});

router.delete('/:id', async (req, res) => {
  const card = await Card.findById(req.params.id);
  await card.remove();

  res.sendStatus(200);
});

module.exports = router;
