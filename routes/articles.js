const articlesRouter = require('express').Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
  getCommentsByArticleId
} = require('../controllers/articles');

articlesRouter.get('/', getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.get('/:article_id/comments', getCommentsByArticleId);

module.exports = articlesRouter;
