const commentsRouter = require('express').Router();
const {
  patchCommentById,
  deleteCommentById
} = require('../controllers/comments');
const { methodNotAllowed } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;
