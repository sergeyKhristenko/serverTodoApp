const express = require('express');
const router = express.Router();
const User = require('../models/User');

const db = require('../utils/DataBaseUtils');

router.get('/notes', (req, res) => {
  db.listNotes().then(data => {
    res.send(data);
  });
});

router.post('/notes', (req, res) => {
  db.createNote(req.body).then(data => {
    res.send(data);
  });
});

router.delete('/notes/:id', (req, res) => {
  db.deleteNote(req.params.id).then(data => {
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
      let error = new Error('Wrong email or password');
      error.status = 401;

      return res.send(error);
    }

    return res.send({id: user.id});
  });
});

module.exports = router;
