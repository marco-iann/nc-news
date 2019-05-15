const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId
} = require('../models/articles');

exports.getArticles = (req, res, next) => {
  selectArticles(req.query).then(articles => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then(article => {
    res.status(200).send(article);
  });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes).then(article => {
    res.status(200).send(article);
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { order } = req.query;
  selectCommentsByArticleId(article_id, order).then(comments => {
    res.status(200).send({ comments });
  });
};
