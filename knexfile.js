const os = require('os');
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || 'development';
const { username, password } =
  os.platform() === 'linux' ? require('./dbConfig') : {};

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: 'news_db',
      username,
      password
    }
  },
  test: {
    connection: {
      database: 'news_db_test',
      username,
      password
    }
  }
};

module.exports = { ...baseConfig, ...customConfig[ENV] };
