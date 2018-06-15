const express = require('express');
const router = express.Router();

const db = require('../utils/DataBaseUtils');

const Board = require('../models/Board').Board;

router.get('/:id', (req, res) => {
  Board.findById(req.params.id)
    .populate('columns')
    .populate({
      path: 'columns',
      populate: { path: 'cards' }
    })
    .exec()
    .then(board => res.send(board));
});

router.post('/', async (req, res) => {
  const body = req.body;
  const board = new Board({
    name: body.name,
    users: [body.userId]
  });

  const createdBoard = await board.save();

  res.send(createdBoard);
});

router.put('/:id', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

  db.updateBoard(token, req.params.id, req.body).then(board => res.send(board));
});

router.get('/', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

  if (!token) {
    res.sendStatus(401);

    return;
  }

  Board.find({ users: token })
    .populate('columns')
    .populate({
      path: 'columns',
      populate: { path: 'cards' }
    })
    .exec()
    .then(data => {
      if (!data || !data.length) {
        res.sendStatus(404);

        return;
      }

      res.send(data);
    });
});

module.exports = router;
