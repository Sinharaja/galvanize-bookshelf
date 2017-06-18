const knex = require('../../knex');


class Favorites {
  getUserFavorites(id) {
    return knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .where('user_id', id);
  }

  isFavorite(userId, bookId) {
    return knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .where('book_id', bookId)
      .where('user_id', userId);
  }

  addFavorite(data) {
    return knex('favorites')
      .insert(data, ['id', 'book_id', 'user_id']);
  }

  deleteFavorite(data) {
    let deletedFavorite = [];
    return knex('favorites')
      .select('user_id', 'book_id')
      .where('user_id', data.user_id)
      .where('book_id', data.book_id)
      .then(favorite => {
        if (favorite !== '') {
          deletedFavorite = favorite;
          knex('favorites')
            .where('user_id', data.user_id)
            .where('book_id', data.book_id)
            .del()
            .then()
        }
      })
      .then(() => {
        return deletedFavorite;
      })
  }
}


module.exports = Favorites;
