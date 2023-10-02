const { config } = require('dotenv');
const { resolve } = require('path');

function getEnvName() {
  if (process.env.NODE_ENV === 'test') {
    return '.env.test';
  }
}

// Load from more specific env file to generic ->
[getEnvName(), '.env'].forEach((envFile) => {
  if (!envFile) return;
  config({
    path: resolve(__dirname, envFile),
  });
});
