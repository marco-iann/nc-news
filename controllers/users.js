const { selectUsers, selectUserByUsername } = require('../models/users');

exports.getUsers = (req, res, next) => {
  selectUsers().then(users => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then(user => {
      if (!user)
        return Promise.reject({ code: 404, msg: 'username not found' });
      res.status(200).send({ user });
    })
    .catch(next);
};
