const usersRouter = require('express').Router();
const { getUsers, getUserByUsername } = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/')
  .get(getUsers)
  .all(methodNotAllowed);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
