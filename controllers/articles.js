const {
  countArticles,
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId
} = require('../models/articles');

const { selectUserByUsername } = require('../models/users');
const { selectTopicBySlug } = require('../models/topics');

exports.getArticles = (req, res, next) => {
  const { author, topic } = req.query;
  const authorPromise = req.query.author ? selectUserByUsername(author) : null;
  const topicPromise = req.query.topic ? selectTopicBySlug(topic) : null;
  Promise.all([
    authorPromise,
    topicPromise,
    selectArticles(req.query),
    countArticles(req.query)
  ])
    .then(([author, topic, articles, articles_count]) => {
      if (!author && req.query.author)
        return Promise.reject({ code: 404, msg: 'author not found' });
      else if (!topic && req.query.topic)
        return Promise.reject({ code: 404, msg: 'topic not found' });
      else res.status(200).send({ articles_count, articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      if (!article)
        return Promise.reject({ code: 404, msg: 'article not found' });
      else res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes && typeof inc_votes !== 'number')
    next({ code: 400, msg: 'invalid votes increment' });
  updateArticleById(article_id, inc_votes)
    .then(article => {
      if (!article)
        return Promise.reject({ code: 404, msg: 'article not found' });
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id, req.query)
  ])
    .then(([article, comments]) => {
      if (!article)
        return Promise.reject({ code: 404, msg: 'article not found' });
      else res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  if (!req.body.username || !req.body.body)
    next({ code: 400, msg: 'invalid post body' });
  selectArticleById(article_id)
    .then(article => {
      if (!article)
        return Promise.reject({ code: 404, msg: 'article not found' });
      else return insertCommentByArticleId(article_id, req.body);
    })
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
