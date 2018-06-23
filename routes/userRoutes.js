const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/register', async (req, res) => {
  const user = new User(({ email, password } = req.body));

  res.send(await user.save());
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.authenticate(email, password, function(err, user) {
    if (err || !user) {
      return res.send(401);
    }

    return res.send({ email: user.email, token: user.id });
  });
});

module.exports = router;
