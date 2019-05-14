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
    .orderBy(sort_by || 'created_at', order || 'desc')
    .returning('*');
};

const selectArticleById = id => {
  return selectArticles({}).then(articles => {
    const article = articles.find(article => article.article_id === 1);
    return Promise.resolve(article);
  });
};

module.exports = { selectArticles, selectArticleById };
