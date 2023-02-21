import { readFileSync } from 'fs';
import { resolve } from 'path';

const getVersion = () => {
  const packageJson: {
    version: string;
    database: string;
  } = JSON.parse(
    readFileSync(resolve(__dirname, '../package.json')).toString()
  );

  return {
    version: packageJson.version,
    database: packageJson.database,
  };
};

export const versions = getVersion();
