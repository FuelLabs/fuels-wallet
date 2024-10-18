import { execa } from 'execa';
import fs from 'node:fs';
import { join } from 'path';

const ROOT_PATH = process.cwd();
const DIST_FOLDER = join(ROOT_PATH, 'dist');
const APP_PATH = '/app/';
const STORYBOOK_PATH = '/storybook/';
const DOWNLOAD_URL = join(APP_PATH, 'fuel-wallet.zip');

function setEnvVar(key, value) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}

export function setEnv() {
  setEnvVar('BASE_URL', APP_PATH);
  setEnvVar('DOCS_BASE_URL', process.env.DOCS_BASE_URL || '');
  setEnvVar('STORYBOOK_BASE_URL', STORYBOOK_PATH);

  // Dist folders
  const docsDist = join(DIST_FOLDER, process.env.DOCS_BASE_URL || '');
  const appDist = join(DIST_FOLDER, APP_PATH);
  const storybookDist = join(DIST_FOLDER, STORYBOOK_PATH);

  setEnvVar('DOCS_DIST', docsDist);
  setEnvVar('APP_DIST', appDist);
  setEnvVar('STORYBOOK_DIST', storybookDist);

  // Set next env vars
  setEnvVar('NEXT_PUBLIC_WALLET_DOWNLOAD_URL', DOWNLOAD_URL);
  setEnvVar('NEXT_PUBLIC_APP_URL', APP_PATH);
  setEnvVar('NEXT_PUBLIC_STORYBOOK_URL', STORYBOOK_PATH);

  // Log dist folders and env vars in one console.log
  console.log(`
    Output dist folders:
    DOCS_DIST: ${docsDist}
    APP_DIST: ${appDist}
    STORYBOOK_DIST: ${storybookDist}

    Environment Variables:
    BASE_URL: ${process.env.BASE_URL}
    DOCS_BASE_URL: ${process.env.DOCS_BASE_URL}
    STORYBOOK_BASE_URL: ${process.env.STORYBOOK_BASE_URL}
    NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL}
    NEXT_PUBLIC_WALLET_DOWNLOAD_URL: ${process.env.NEXT_PUBLIC_WALLET_DOWNLOAD_URL}
    NEXT_PUBLIC_STORYBOOK_URL: ${process.env.NEXT_PUBLIC_STORYBOOK_URL}
  `);
}

export async function runPnpmCmd(cmds) {
  await execa('pnpm', cmds, { stdio: 'inherit' });
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
