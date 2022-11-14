const { load } = require('routing2');

module.exports = {
  routes: load('./server/routes.txt'),
  render: 'jade',
  database: {
    dialect: 'sqlite',
    storage: 'user.db',
  },
  plugins: [
    'static',
    'cookie',
    'render',
    'database',
    'errorHandler',
    'user',
    'defaultHandler'
  ],
};
