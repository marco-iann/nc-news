const topicsRouter = require('express').Router();

const { getTopics, getTopicBySlug } = require('../controllers/topics');
const { methodNotAllowed } = require('../errors');

topicsRouter
  .route('/')
  .get(getTopics)
  .all(methodNotAllowed);

topicsRouter
  .route('/:slug')
  .get(getTopicBySlug)
  .all(methodNotAllowed);

module.exports = topicsRouter;
