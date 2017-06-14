const bcrypt = require('bcrypt');
const knex = require('../../knex');

class Users {

  getbyEmail(email) {
    return knex("users")
      .where("email", email)
  }

  create(data) {
    return bcrypt.hash(data.password, 5)
      .then(hashedPassword => {
        return knex("users")
          .insert({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            hashed_password: hashedPassword
          }, ['id', 'first_name', 'last_name', 'email']);
      })
  }
}

module.exports = Users;
