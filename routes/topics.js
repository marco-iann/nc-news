const topicsRouter = require('express').Router();

const {
  getTopics,
  postTopic,
  getTopicBySlug
} = require('../controllers/topics');
const { methodNotAllowed } = require('../errors');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(methodNotAllowed);

topicsRouter
  .route('/:slug')
  .get(getTopicBySlug)
  .all(methodNotAllowed);

module.exports = topicsRouter;
