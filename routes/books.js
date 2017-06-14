'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const Books = require('../src/model/Books');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get("/books", (req, res) => {
  let book = new Books();
  book.getAll()
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result));
    });
});

router.get("/books/:id", (req, res) => {
  let book = new Books();
    book.getById(req.params.id)
      .then(result => {
        res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

router.post("/books", (req, res) => {
  let book = new Books();
  book.create(humps.decamelizeKeys(req.body))
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

router.patch('/books/:id', (req, res) => {
  let book = new Books();
  book.update(req.params.id, humps.decamelizeKeys(req.body))
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

router.delete("/books/:id", (req, res) => {
  let book = new Books();
  book.deleteBook(req.params.id)
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
  });
});

module.exports = router;
