var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'rockolapp'
    },
    port: 3000,
    db: 'mysql://root@localhost/rockolapp_development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'rockolapp'
    },
    port: 3000,
    db: 'mysql://root@localhost/rockolapp_test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'rockolapp'
    },
    port: 3000,
    db: 'mysql://root@localhost/rockolapp_production'
  }
};

module.exports = config[env];
