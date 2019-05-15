const articlesRouter = require('express').Router();

const {
  getArticles,
  getArticleById,
  patchArticleById
} = require('../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

module.exports = articlesRouter;
