const developmentData = require('./development-data/index');
const testData = require('./test-data/index');

const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') module.exports = developmentData;
else if (ENV === 'test') module.exports = testData;
