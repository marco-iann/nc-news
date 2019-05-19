const usersRouter = require('express').Router();
const {
  getUsers,
  postUser,
  getUserByUsername
} = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/')
  .get(getUsers)
  .post(postUser)
  .all(methodNotAllowed);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
