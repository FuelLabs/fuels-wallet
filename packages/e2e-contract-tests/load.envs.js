const { config } = require('dotenv');
const { resolve } = require('node:path');

function getEnvName() {
  if (process.env.NODE_ENV === 'test') {
    return '.env.example';
  }
}

// Load from more specific env file to generic ->
// biome-ignore lint/complexity/noForEach: <explanation>
[getEnvName(), '.env'].forEach((envFile) => {
  if (!envFile) return;
  config({
    path: resolve(__dirname, envFile),
  });
});
