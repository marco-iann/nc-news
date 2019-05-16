const commentsRouter = require('express').Router();
const {
  getCommentById,
  patchCommentById,
  deleteCommentById
} = require('../controllers/comments');
const { methodNotAllowed } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .get(getCommentById)
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;
