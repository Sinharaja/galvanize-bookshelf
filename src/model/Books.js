const knex = require('../../knex');
const { decamelizeKeys, camelizeKeys } = require('humps');

class Books {

  getAll() {
    return knex("books")
      .orderBy("title")
      .then(result => camelizeKeys(result))
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  }

  getById(id) {
    return knex("books")
      .where({ id: id })
      .first()
      .then(result => (result ? camelizeKeys(result) : undefined))
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  }

  create(book) {
    book = decamelizeKeys(book);

    return knex("books")
      .insert(book, ["id", "title", "author", "genre", "description", "cover_url"])
      .then(result => {
        return camelizeKeys(result[0]);
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  }

  update(id, book) {
    book = decamelizeKeys(book);

    if (book.id) return; // data to update can't have an id

    return knex("books")
      .where({ id: id })
      .first()
      .then(result => {
        if (!result) {
          return undefined;
        }
        return knex("books")
          .where('id', id)
          .update(book, ["id", "title", "author", "genre", "description", "cover_url"])
          .then(result => camelizeKeys(result[0]));
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  }

  deleteBook(id) {
    return knex("books")
      .select("title", "author", "genre", "description", "cover_url")
      .where({ id: id })
      .first()
      .then(book => {
        if (!book) {
          return undefined;
        }
        return knex("books")
          .where("id", id)
          .del()
          .then(() => camelizeKeys(book));
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
  }

}

module.exports = Books;
