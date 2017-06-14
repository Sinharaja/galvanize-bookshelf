'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const Books = require('../src/model/Books');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get("/books", (req, res) => {
  // knex("books")
  //   .orderBy("title")
  let book = new Books();
  book.getAll()
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result));
    });
});

router.get("/books/:id", (req, res) => {
  let book = new Books();
  // knex("books")
    // .where("id", req.params.id)
    book.getById(req.params.id)
      .then(result => {
        res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

router.post("/books", (req, res) => {
  // knex("books")
  //   .insert(humps.decamelizeKeys(req.body), ["id", "title", "author", "genre", "description", "cover_url"])
  let book = new Books();
  book.create(humps.decamelizeKeys(req.body))
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

router.patch('/books/:id', (req, res) => {
  // knex('books')
  //   .where('id', req.params.id)
  //   .update(humps.decamelizeKeys(req.body), ["id", "title", "author", "genre", "description", "cover_url"])
  let book = new Books();
  book.update(req.params.id, humps.decamelizeKeys(req.body))
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

router.delete("/books/:id", (req, res) => {
  // knex("books")
  // .select("title", "author", "genre", "description", "cover_url")
  //   .where("id", req.params.id)
  //   .then(result => {
  //     if (result != '') {
  //       let output = result;
  //       knex("books")
  //       .where("id", req.params.id)
  //       .del()
  let book = new Books();
  book.deleteBook(req.params.id)
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
  });
});

module.exports = router;
