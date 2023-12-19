/* eslint-disable no-console */
import chalk from 'chalk';

import { Github } from './Github';
import { NpmPackage } from './NpmPackage';
import { PackageJson } from './PackageJson';

async function getRcVersions(): Promise<string[]> {
  console.log(chalk.green('Fetching RC versions...'));
  const pkg = new NpmPackage('fuels');
  return pkg.getVersions({ version: /rc-/ });
}

async function getUnreleasedVersions(): Promise<string[]> {
  console.log(chalk.green('Checking unreleased versions...'));
  const versions = await getRcVersions();
  return await Promise.all(
    versions.filter(async (version) => {
      const github = new Github('fuellabs', 'fuels-wallet');
      const rcBranch = `sdk-update/${version}`;
      const pulls = await github.getClosedPullRequests({
        base: 'master',
        head: rcBranch,
      });
      return !pulls.length;
    })
  );
}

async function createReleases() {
  const pkgs = await PackageJson.getAllLocal();
  const versions = await getUnreleasedVersions();

  for (const version of versions) {
    // TODO: create a new pull request updating the packages
  }
}

async function main() {
  await createReleases();
}

main();
