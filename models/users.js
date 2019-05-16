const connection = require('../db/connection');

const selectUserByUsername = username => {
  return connection('users')
    .select('*')
    .where({ username })
    .first();
};

module.exports = { selectUserByUsername };
