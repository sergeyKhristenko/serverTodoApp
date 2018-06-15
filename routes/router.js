const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Column = require('../models/Board').Column;
const Board = require('../models/Board').Board;

const db = require('../utils/DataBaseUtils');

router.get('/notes', (req, res) => {
  db.listNotes().then(data => res.send(data));
});

router.post('/notes', (req, res) => {
  db.createNote(req.body).then(data => res.send(data));
});

router.put('/notes/:id', (req, res) => {
  db.updateNote(req.params.id, req.body).then(updateNote => res.send(updateNote));
});

router.delete('/notes/:id', (req, res) => {
  db.deleteNote(req.params.id).then(data => {
    res.send(data);
  });
});

router.get('/boards/:id', (req, res) => {
  db.getBoard(req.params.id).then(board => res.send(board));
});

router.post('/boards', (req, res) => {
  db.createBoard(req.body).then(createBoard => res.send(createBoard));
});

router.put('/boards/:id', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

  db.updateBoard(token, req.params.id, req.body).then(board => res.send(board));
});

router.post('/columns', (req, res) => {
  db.createColumn(req.body).then(column => res.send(column));
});

router.put('/columns/:id', (req, res) => {
  db.updateColumn(req.params.id, req.body).then(column => res.send(column));
});

router.get('/boards', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

  if (!token) {
    res.sendStatus(401);

    return;
  }

  db.listBoards(token).then(data => {
    if (!data || !data.length) {
      res.sendStatus(404);

      return;
    }

    res.send(data);
  });
});

router.post('/register', (req, res) => {
  db.createUser(req.body).then(data => {
    res.send(data);
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.authenticate(email, password, function(err, user) {
    if (err || !user) {
      return res.send(401);
    }

    return res.send({ token: user.id });
  });
});

module.exports = router;
