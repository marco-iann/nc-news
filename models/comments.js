const connection = require('../db/connection');

const updateCommentById = (id, inc_votes) => {
  return connection('comments')
    .where({ comment_id: id })
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => comment);
};

const removeCommentById = id => {
  return connection('comments').where({ comment_id: id });
};

module.exports = { updateCommentById, removeCommentById };
