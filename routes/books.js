'use strict';

const express = require('express');
const knex = require('../knex');
const Books = require('../src/model/Books');

// eslint-disable-next-line new-cap
const router = express.Router();

let book = new Books();

// YOUR CODE HERE
router.get("/books", (req, res) => {
  book.getAll()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.sendStatus(404);
  }

  book.getById(id)
    .then(book => {
      if (!book) {
        return res.sendStatus(404);
      }
      res.send(book);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.post("/books", (req, res) => {
  const dataToAdd = req.body;

  if (!dataToAdd.title) {
    return res.status(400).set('Content-Type', 'text/plain').send("Title must not be blank");
  }

  if (!dataToAdd.author) {
    return res.status(400).set('Content-Type', 'text/plain').send("Author must not be blank");
  }

  if (!dataToAdd.genre) {
    return res.status(400).set('Content-Type', 'text/plain').send("Genre must not be blank");
  }

  if (!dataToAdd.description) {
    return res.status(400).set('Content-Type', 'text/plain').send("Description must not be blank");
  }

  if (!dataToAdd.coverUrl) {
    return res.status(400).set('Content-Type', 'text/plain').send("Cover URL must not be blank");
  }

  book.create(dataToAdd)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.patch('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dataToUpdate = req.body;

  if (isNaN(id) || id <= 0) {
    return res.sendStatus(404);
  }

  book.update(id, dataToUpdate)
    .then(result => {
      if (!result){
        return res.sendStatus(404);
      }
      res.send(result);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.sendStatus(404);
  }

  book.deleteBook(id)
    .then(result => {
      if (!result) {
        return res.sendStatus(404);
      }
      res.send(result);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = router;
