'use strict';

const express = require('express');
const jwt = require("jsonwebtoken");
const Favorites = require('../src/model/Favorites');
const Books = require('../src/model/Books');
const humps = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

let favorite = new Favorites();
let book = new Books();

// YOUR CODE HERE
router.get('/favorites', (req, res) => {
  let token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      favorite.getUserFavorites(decoded.id)
        .then(result => {
          res.send(humps.camelizeKeys(result));
        });
    });
  } else {
    res.sendStatus(401);
  }
});

router.get('/favorites/check', (req, res) => {
  if (isNaN(req.query.bookId)) {
    return res.status(400).set("Content-Type", "text/plain").send("Book ID must be an integer");
  }

  let token = req.cookies.token;
  let bookId = req.query.bookId;

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      favorite.isFavorite(decoded.id, bookId)
        .then(result => {
          if (result.length === 0) {
            return res.status(200).set("Content-Type", "application/json").send("false");
          }
          res.status(200).set("Content-Type", "application/json").send("true");
        });
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/favorites', (req, res) => {
  if (isNaN(req.body.bookId * 1)) {
    return res.status(400).set("Content-Type", "text/plain").send("Book ID must be an integer");
  }
  let token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      let fav = {
        user_id: decoded.id,
        book_id: req.body.bookId
      }
      book.getById(req.body.bookId)
        .then(result => {
          if (result.length === 0) {
            return res.status(404).set("Content-Type", "text/plain").send("Book not found");
          }
          favorite.addFavorite(fav)
            .then(result => {
              if (result.length === 0) {
                return res.status(200).set("Content-Type", "application/json").send("false");
              }
              res.send(humps.camelizeKeys(result[0]));
            });
        });
    });
  } else {
    res.sendStatus(401);
  }
});

router.delete('/favorites', (req, res) => {
  if (isNaN(req.body.bookId)) {
    return res.status(400).set("Content-Type", "text/plain").send("Book ID must be an integer");
  }

  let token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      let fav = {
        user_id: decoded.id,
        book_id: req.body.bookId
      }
      favorite.isFavorite(decoded.id, req.body.bookId)
        .then(result => {
          if (result.length === 0){
            return res.status(404).set("Content-Type", "text/plain").send("Favorite not found");
          }
          favorite.deleteFavorite(fav)
            .then(result => {
              if (result.length === 0) {
                return res.status(200).set("Content-Type", "application/json").send("false");
              }
              res.send(humps.camelizeKeys(result[0]));
            });
        });
    });
  } else {
    res.sendStatus(401);
  }
});


module.exports = router;
