const connection = require('../db/connection');

const countArticles = ({ author, topic }) => {
  return connection('articles')
    .select('*')
    .modify(query => {
      if (author) query.where({ 'articles.author': author });
      if (topic) query.where({ 'articles.topic': topic });
    })
    .then(articles => articles.length);
};

const selectArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic,
  limit = 10,
  p = 1
}) => {
  if (order !== 'asc' && order !== 'desc') order = 'desc';
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
      if (p) query.offset((p - 1) * limit);
    })
    .limit(limit)
    .count({ comments_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order);
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
    .count({ comments_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .first();
};

const updateArticleById = (id, inc_votes) => {
  return connection('articles')
    .where({ article_id: id })
    .modify(query => {
      if (inc_votes) query.increment('votes', inc_votes);
    })
    .returning('*')
    .then(([article]) => article);
};

const selectCommentsByArticleId = (
  id,
  { order = 'desc', sort_by = 'created_at', limit = 10, p = 1 }
) => {
  return connection('comments')
    .select('author', 'body', 'votes', 'comment_id', 'created_at')
    .limit(limit)
    .modify(query => {
      if (p) query.offset((p - 1) * limit);
    })
    .where({ article_id: id })
    .orderBy(sort_by, order);
};

const insertCommentByArticleId = (id, { username, body }) => {
  return connection('comments')
    .insert({
      author: username,
      body,
      article_id: id
    })
    .returning('*');
};

module.exports = {
  countArticles,
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId
};
