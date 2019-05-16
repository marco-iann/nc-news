const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId
} = require('../models/articles');

const { selectUserByUsername } = require('../models/users');

exports.getArticles = (req, res, next) => {
  const { author, topic } = req.query;
  // TODO handle topic query in the same way
  const authorPromise = req.query.author ? selectUserByUsername(author) : null;
  Promise.all([authorPromise])
    .then(([author]) => {
      if (!author && req.query.author)
        return Promise.reject({ code: 404, msg: 'author not found' });
      else return selectArticles(req.query);
    })
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      if (!article)
        return Promise.reject({ code: 404, msg: 'article not found' });
      else res.status(200).send(article);
    })
    .catch(next);
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
  selectCommentsByArticleId(article_id, req.query).then(comments => {
    res.status(200).send({ comments });
  });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  insertCommentByArticleId(article_id, req.body).then(([comment]) => {
    res.status(201).send({ comment });
  });
};
