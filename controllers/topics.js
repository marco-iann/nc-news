const {
  selectTopics,
  insertTopic,
  selectTopicBySlug
} = require('../models/topics');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  insertTopic(req.body).then(([topic]) => {
    res.status(201).send({ topic });
  });
};

exports.getTopicBySlug = (req, res, next) => {
  const { slug } = req.params;
  selectTopicBySlug(slug)
    .then(topic => {
      if (!topic) return Promise.reject({ code: 404, msg: 'topic not found' });
      res.status(200).send({ topic });
    })
    .catch(next);
};
