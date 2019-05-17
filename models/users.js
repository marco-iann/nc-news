const connection = require('../db/connection');

const selectUsers = () => {
  return connection('users').select('*');
};

const selectUserByUsername = username => {
  return connection('users')
    .select('*')
    .where({ username })
    .first();
};

module.exports = { selectUsers, selectUserByUsername };
