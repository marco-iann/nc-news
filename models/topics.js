const connection = require('../db/connection');

exports.selectTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .returning('*');
};

exports.insertTopic = ({ slug, description }) => {
  return connection('topics')
    .insert({ slug, description })
    .returning('*');
};

exports.selectTopicBySlug = slug => {
  return connection('topics')
    .select('*')
    .where({ slug })
    .first();
};
