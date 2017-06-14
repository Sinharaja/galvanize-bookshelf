const knex = require('../../knex');
const humps = require('humps');

class Books {

  getAll() {
    return knex("books")
      .orderBy("title")
  }

  getById(id) {
    return knex("books")
      .where("id", id)
  }

  create(data) {
    return knex("books")
      .insert(data, ["id", "title", "author", "genre", "description", "cover_url"])
  }

  update(id, bookData) {
    return knex('books')
      .where('id', id)
      .update(bookData, ["id", "title", "author", "genre", "description", "cover_url"])

  }

  deleteBook(id) {
    let deletedBook;
    return knex("books")
      .select("title", "author", "genre", "description", "cover_url")
      .where("id", id)
      .then(book => {
        if (book != '') {
          deletedBook = book;
          knex("books")
          .where("id", id)
          .del()
        }
      })
      .then(() => {
        return deletedBook;
      });
  }

}

module.exports = Books;
