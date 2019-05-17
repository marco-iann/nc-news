const developmentData = require('./development-data/index');
const testData = require('./test-data/index');

const ENV = process.env.NODE_ENV || 'development';

const data = {
  test: testData,
  development: developmentData,
  production: developmentData
};

module.exports = data[ENV];
