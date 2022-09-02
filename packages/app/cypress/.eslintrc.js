const config = require('../../config');

module.exports = {
  ...config,
  plugins: [...config.plugins, 'cypress'],
  extends: [...config.extends, 'plugin:cypress/recommended'],
};
