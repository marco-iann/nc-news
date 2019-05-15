const connection = require('../db/connection');

const selectUsers = username => {
  return connection('users')
    .select('*')
    .where({ username })
    .first();
};

module.exports = { selectUsers };
