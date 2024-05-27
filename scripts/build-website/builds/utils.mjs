import { execa } from 'execa';
import fs from 'node:fs';
import { join } from 'path';

const ROOT_PATH = process.cwd();
const DIST_FOLDER = join(ROOT_PATH, './dist');
const APP_PATH = '/app/';
const STORYBOOK_PATH = '/storybook/';
const DOWNLOAD_URL = join(APP_PATH, '/fuel-wallet.zip');

function setEnvVar(key, value) {
  process.env[key] = process.env[key] || value;
}

export function setEnv() {
  setEnvVar('BASE_URL', APP_PATH);
  setEnvVar('DOCS_BASE_URL', process.env.DOCS_BASE_URL || '');
  setEnvVar('STORYBOOK_BASE_URL', STORYBOOK_PATH);

  // Dist folders
  setEnvVar('DOCS_DIST', join(DIST_FOLDER, process.env.DOCS_BASE_URL || ''));
  setEnvVar('APP_DIST', join(DIST_FOLDER, APP_PATH));
  setEnvVar('STORYBOOK_DIST', join(DIST_FOLDER, STORYBOOK_PATH));

  // Set next env vars
  setEnvVar('NEXT_PUBLIC_WALLET_DOWNLOAD_URL', DOWNLOAD_URL);
  setEnvVar('NEXT_PUBLIC_APP_URL', APP_PATH);
  setEnvVar('NEXT_PUBLIC_STORYBOOK_URL', STORYBOOK_PATH);

  // Log dist folders
  console.log('Output dist folders:');
  console.log('DOCS_DIST', process.env.DOCS_DIST);
  console.log('APP_DIST', process.env.APP_DIST);
  console.log('STORYBOOK_DIST', process.env.STORYBOOK_DIST);

  // Log env vars
  console.log('Output dist folders:');
  console.log('BASE_URL', process.env.BASE_URL);
  console.log('DOCS_BASE_URL', process.env.DOCS_BASE_URL);
  console.log('STORYBOOK_BASE_URL', process.env.STORYBOOK_BASE_URL);
  console.log('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL);
  console.log(
    'NEXT_PUBLIC_WALLET_DOWNLOAD_URL',
    process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL
  );
  console.log(
    'NEXT_PUBLIC_STORYBOOK_URL',
    process.env.NEXT_PUBLIC_STORYBOOK_URL
  );
}

export async function runPnpmCmd(cmds) {
  await execa('pnpm', cmds, { stdout: 'inherit' });
}

export async function moveDocs() {
  await execa('mv', ['./packages/docs/out', process.env.DOCS_DIST]);
}

export async function buildWebsite() {
  fs.rmSync(DIST_FOLDER, { recursive: true, force: true });
  await runPnpmCmd(['build:preview', '--force', '--no-cache']);
  await moveDocs();
  await runPnpmCmd(['build:all', '--force', '--no-cache']);
}
