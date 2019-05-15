const commentsRouter = require('express').Router();
const { patchCommentById } = require('../controllers/comments');

commentsRouter.patch('/:comment_id', patchCommentById);

module.exports = commentsRouter;
