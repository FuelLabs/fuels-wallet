const { config } = require('dotenv');
const { resolve } = require('node:path');

config({
  path: resolve(__dirname, '.env'),
});
