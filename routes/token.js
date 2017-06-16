'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const Users = require('../src/model/Users');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
let user = new Users();

router.get("/token", (req, res) => {
  if (!req.cookies.token) {
    // console.log(req.headers.cookie);
    return res.status(200).set('Content-Type', 'application/json').send("false");
  }
  res.status(200).set('Content-Type', 'application/json').send("true")
})

router.post("/token", (req, res) => {
  const {email, password} = req.body;

  if (!email) {
    return res.status(400).set('Content-Type', 'text/plain').send("Email must not be blank");
  }

  if (!password) {
    return res.status(400).set('Content-Type', 'text/plain').send("Password must not be blank");
  }

  user.getbyEmail(email)
    .then(result => {
      if (result.length === 0) {
        return res.status(400).set('Content-Type', 'text/plain').send("Bad email or password");
      }
      const payload = {
        id: result[0].id,
        firstName: result[0].first_name,
        lastName: result[0].last_name,
        email: result[0].email
      }
      bcrypt.compare(password, result[0].hashed_password)
        .then(result => {
          if (!result) {
            return res.status(400).set('Content-Type', 'text/plain').send("Bad email or password");
          }
          const secret = process.env.JWT_KEY;
          const token = jwt.sign(payload, secret);
          res.cookie("token", token, {httpOnly: true}).send(payload);
        })
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
})

router.delete("/token", (req, res) => {
  res.cookie("token", "").send("true");
})

module.exports = router;
