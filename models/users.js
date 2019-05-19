const connection = require('../db/connection');

const selectUsers = () => {
  return connection('users').select('*');
};

const insertUser = ({ username, avatar_url, name }) => {
  return connection('users')
    .insert({ username, avatar_url, name })
    .returning('*');
};

const selectUserByUsername = username => {
  return connection('users')
    .select('*')
    .where({ username })
    .first();
};

module.exports = { selectUsers, insertUser, selectUserByUsername };
