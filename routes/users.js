'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const Users = require('../src/model/Users');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post("/users", (req, res) => {
  if (!req.body.email) {
    return res.status(400).set('Content-Type', 'text/plain').send("Email must not be blank");
  }

  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).set('Content-Type', 'text/plain').send("Password must be at least 8 characters long");
  }

  let user = new Users();
  user.getbyEmail(req.body.email)
    .then(result => {

      if (result.length > 0) {
        return res.status(400).set('Content-Type', 'text/plain').send("Email already exists");
      }

      user.create(req.body)
      .then(result => {
        const payload = {
          id: result[0].id,
          firstName: result[0].first_name,
          lastName: result[0].last_name,
          email: result[0].email
        }
        const secret = process.env.JWT_KEY;
        const token = jwt.sign(payload, secret);
        res.cookie("token", token, {httpOnly: true});
        res.status(200).json(humps.camelizeKeys(result[0]))
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      })
    })

})

module.exports = router;
