const { selectArticles } = require('../models/articles');

exports.getArticles = (req, res, next) => {
  selectArticles(req.query).then(articles => {
    res.status(200).send({ articles });
  });
};
