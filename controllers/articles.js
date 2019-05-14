const { selectArticles } = require('../models/articles');

exports.getArticles = (req, res, next) => {
  selectArticles().then(articles => {
    console.log(articles);
    res.status(200).send({ articles });
  });
};
