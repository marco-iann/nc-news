const {
  topicsData,
  usersData,
  articlesData,
  commentsData
} = require(`../index`);

const {
  formatTimestamps,
  createRef,
  formatComments,
  renameKeys
} = require('../utils/utils');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicsData)
        .returning('*');
    })
    .then(() => {
      return knex('users')
        .insert(usersData)
        .returning('*');
    })
    .then(() => {
      const formattedArticlesData = formatTimestamps(articlesData);
      return knex('articles')
        .insert(formattedArticlesData)
        .returning('*');
    })
    .then(articlesRows => {
      const articlesRefObject = createRef(articlesRows, 'title', 'article_id');
      let formattedComments = formatComments(commentsData, articlesRefObject);
      formattedComments = renameKeys(formattedComments, 'created_by', 'author');
      formattedComments = formatTimestamps(formattedComments);
      return knex('comments')
        .insert(formattedComments)
        .returning('*');
    });
};
