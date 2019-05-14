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
} = require('../utils');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      console.log('Inserting topics');
      return knex('topics')
        .insert(topicsData)
        .returning('*');
    })
    .then(() => {
      console.log('Inserting users');
      return knex('users')
        .insert(usersData)
        .returning('*');
    })
    .then(() => {
      console.log('Inserting articles');
      const formattedArticlesData = formatTimestamps(articlesData);
      return knex('articles')
        .insert(formattedArticlesData)
        .returning('*');
    })
    .then(articlesRows => {
      console.log('Inserting comments');
      const articlesRefObject = createRef(articlesRows, 'title', 'article_id');
      let formattedComments = formatComments(commentsData, articlesRefObject);
      formattedComments = renameKeys(formattedComments, 'created_by', 'author');
      formattedComments = formatTimestamps(formattedComments);
      return knex('comments')
        .insert(formattedComments)
        .returning('*');
    });
};
