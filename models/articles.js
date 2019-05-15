const connection = require('../db/connection');

const selectArticles = ({ sort_by, order, author, topic }) => {
  return connection
    .select(
      'articles.author',
      'articles.title',
      'articles.topic',
      'articles.created_at',
      'articles.votes',
      'articles.article_id'
    )
    .from('articles')
    .modify(query => {
      if (author) query.where({ 'articles.author': author });
      if (topic) query.where({ 'articles.topic': topic });
    })
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc');
};

const selectArticleById = id => {
  return connection
    .select(
      'articles.author',
      'articles.title',
      'articles.topic',
      'articles.created_at',
      'articles.votes',
      'articles.article_id',
      'articles.body'
    )
    .from('articles')
    .where({ 'articles.article_id': id })
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .first();
};

const updateArticleById = (id, inc_votes) => {
  return connection('articles')
    .where({ article_id: id })
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => article);
};

const selectCommentsByArticleId = (id, { order, sort_by }) => {
  return connection('comments')
    .select('author', 'body', 'votes', 'comment_id', 'created_at')
    .where({ article_id: id })
    .orderBy(sort_by || 'created_at', order || 'desc');
};

const insertCommentByArticleId = (id, { username, body }) => {
  return connection('comments')
    .insert({
      author: username,
      body,
      article_id: id,
      created_at: new Date(Date.now())
    })
    .returning('*');
};

module.exports = {
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId
};
