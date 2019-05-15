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

module.exports = { selectArticles, selectArticleById, updateArticleById };
