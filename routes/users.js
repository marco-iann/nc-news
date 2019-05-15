const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/users');

usersRouter.route('/:username').get(getUsers);

module.exports = usersRouter;
