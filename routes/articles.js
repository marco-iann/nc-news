const articlesRouter = require('express').Router();

const {
  getArticles,
  postArticle,
  getArticleById,
  patchArticleById,
  getCommentsByArticleId,
  postCommentByArticleId
} = require('../controllers/articles');
const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(methodNotAllowed);

module.exports = articlesRouter;
