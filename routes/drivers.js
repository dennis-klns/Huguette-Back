var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');


router.post('/signUpDriver', (req, res) => {
  if (!checkBody(req.body, ['lastname','firstname', 'phone', 'email', 'password', 'birthdate', 'gender'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // rajout de la route pour créer un driver
  User.findOne({ phone: req.body.phone }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        phone: req.body.phone,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
        password: hash,
        token: uid2(32),
        type: 'driver',
        isBanned: false,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});


module.exports = router;
