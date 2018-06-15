const express = require('express');
const router = express.Router();

const db = require('../utils/DataBaseUtils');

router.post('/', (req, res) => {
  db.createColumn(req.body).then(column => res.send(column));
});

router.put('/:id', (req, res) => {
  db.updateColumn(req.params.id, req.body).then(column => res.send(column));
});

module.exports = router;
