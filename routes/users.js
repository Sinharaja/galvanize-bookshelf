'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const Users = require('../src/model/Users');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post("/users", (req, res) => {
  let user = new Users();
  user.create(req.body)
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]))
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
})

module.exports = router;
