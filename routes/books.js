'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get("/books", (req, res) => {
  knex("books")
    .orderBy("title")
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result));
    })
})

router.get("/books/:id", (req, res) => {
  knex("books")
    .where("id", req.params.id)
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
    })
})

router.post("/books", (req, res) => {
  knex("books")
    .insert(humps.decamelizeKeys(req.body), ["id", "title", "author", "genre", "description", "cover_url"])
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
    })
})


router.delete("/books/:id", (req, res) => {

  knex("books")
  .select("title", "author", "genre", "description", "cover_url")
    .where("id", req.params.id)
    .then(result => {
      if (result != '') {
        console.log('here');
        let output = result;
        // return output;
        knex("books")
        .where("id", req.params.id)
        .del()
        .then(result => {
          // console.log(humps.camelizeKeys(output[0]));
          res.status(200).json(humps.camelizeKeys(output[0]));
        })
      }
    })
})

module.exports = router;
