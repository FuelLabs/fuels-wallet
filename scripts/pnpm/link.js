const fs = require('fs-extra');
const path = require('node:path');
const homedir = require('os').homedir();

async function main() {
  const storeDir = path.resolve(homedir, '.pnpm-link-store');
  const to = path.resolve(storeDir, '@fuel-ui');
  const from = path.resolve(__dirname, '../../design-system');
  fs.removeSync(from);
  fs.copySync(to, from);
}

main();
