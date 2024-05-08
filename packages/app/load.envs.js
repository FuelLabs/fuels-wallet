const { config } = require('dotenv');
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const { resolve } = require('path');
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const { readFileSync } = require('fs');

function getVersion() {
  const packageJson = JSON.parse(
    readFileSync(resolve(__dirname, './package.json')).toString()
  );
  return {
    version: packageJson.version,
    database: packageJson.database,
  };
}

function getEnvName() {
  if (process.env.NODE_ENV === 'production') {
    return '.env.production';
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

function getPublicEnvs() {
  const WHITELIST = ['NODE_ENV', 'PUBLIC_URL'];
  return Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      WHITELIST.some((k) => k === key || key.match(/^VITE_/))
    )
  );
}

// Export the version to be used on database
// and application level
const versions = getVersion();
process.env.PORT = 3000;
process.env.VITE_APP_VERSION = process.env.VITE_APP_VERSION || versions.version;
process.env.VITE_DATABASE_VERSION = versions.database;

module.exports.getPublicEnvs = getPublicEnvs;
