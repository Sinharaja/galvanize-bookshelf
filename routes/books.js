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
  if (isNaN(req.params.id) || req.params.id * 1 <= 0) {
    return res.sendStatus(404);
  }

  let book = new Books();
  book.getById(req.params.id)
    .then(result => {
      if (result.length < 1) {
        return res.sendStatus(404);
      }
      res.status(200).json(humps.camelizeKeys(result[0]));
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.post("/books", (req, res) => {
  if (!req.body.title) {
    return res.status(400).set('Content-Type', 'text/plain').send("Title must not be blank");
  }

  if (!req.body.author) {
    return res.status(400).set('Content-Type', 'text/plain').send("Author must not be blank");
  }

  if (!req.body.genre) {
    return res.status(400).set('Content-Type', 'text/plain').send("Genre must not be blank");
  }

  if (!req.body.description) {
    return res.status(400).set('Content-Type', 'text/plain').send("Description must not be blank");
  }

  if (!req.body.coverUrl) {
    return res.status(400).set('Content-Type', 'text/plain').send("Cover URL must not be blank");
  }

  let book = new Books();
  book.create(humps.decamelizeKeys(req.body))
    .then(result => {
      res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

router.patch('/books/:id', (req, res) => {
  if (isNaN(req.params.id) || req.params.id * 1 <= 0) {
    return res.sendStatus(404);
  }

  let book = new Books();

  book.getById(req.params.id)   //Make sure id exists in database first!
    .then(result => {
      if (result.length > 0) {
        book.update(req.params.id, humps.decamelizeKeys(req.body))
        .then(result => {
          res.status(200).json(humps.camelizeKeys(result[0]));
        })
        .catch(err => {
          console.error(err);
          res.sendStatus(500);
        });
      }
      return res.sendStatus(404);
    })
});

router.delete("/books/:id", (req, res) => {
  if (isNaN(req.params.id) || req.params.id * 1 <= 0) {
    return res.sendStatus(404);
  }
  let book = new Books();
  book.deleteBook(req.params.id)
    .then(result => {
      if (result.length < 1) {
        return res.sendStatus(404);
      }
      res.status(200).json(humps.camelizeKeys(result[0]));
    });
});

module.exports = router;
