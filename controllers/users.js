const { selectUserByUsername } = require('../models/users');

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
