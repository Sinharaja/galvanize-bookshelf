const bcrypt = require('bcrypt');
const knex = require('../../knex');

class Users {
  create(data) {
    return bcrypt.hash(data.password, 5)
      .then(hashedPassword => {
        // console.log(hashedPassword);
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
