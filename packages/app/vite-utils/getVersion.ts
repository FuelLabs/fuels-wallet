import { readFileSync } from 'fs';
import { resolve } from 'path';

export const getVersion = () => {
  const packageJson: {
    version: string;
  } = JSON.parse(
    readFileSync(resolve(__dirname, '../package.json')).toString()
  );

  return packageJson.version;
};
