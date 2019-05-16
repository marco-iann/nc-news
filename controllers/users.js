const { selectUserByUsername } = require('../models/users');

exports.getUsers = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username).then(user => {
    res.status(200).send(user);
  });
};
