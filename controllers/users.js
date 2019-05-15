const { selectUsers } = require('../models/users');

exports.getUsers = (req, res, next) => {
  const { username } = req.params;
  selectUsers(username).then(user => {
    res.status(200).send(user);
  });
};
