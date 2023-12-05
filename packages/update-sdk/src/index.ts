/* eslint-disable no-console */
import chalk from 'chalk';
import { compare } from 'compare-versions';
import { $ } from 'execa';
import { glob } from 'glob';
import { produce } from 'immer';
import minimist from 'minimist';
import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import packageJson from 'package-json';
import prettier from 'prettier';

const TOKEN = process.env.GITHUB_TOKEN!;
const HEAD_BRANCH = process.env.HEAD_BRANCH!;

async function getLatestRcVersion() {
  const pkgJSON = await packageJson('fuels', { version: 'latest' });
  return pkgJSON.version as string;
}

function checkAgainstLatest(latest: string) {
  return async (pkgJSONPath: string, key: string) => {
    const raw = await fs.readFile(pkgJSONPath, 'utf8');
    const pkgJSON = JSON.parse(raw);
    const obj = pkgJSON?.[key] ?? {};
    const entries = Object.entries(obj);
    const sdkDeps = entries.filter(
      ([dep]) => dep === 'fuels' || dep.startsWith('@fuel-ts')
    );

    if (!sdkDeps.length) return false;
    const sdkDep = sdkDeps[0] as [string, string];
    const [_, version] = sdkDep;
    if (compare(version, latest, '>=')) return false;

    console.log(`\n${chalk.red(`Outdated SDK at ${key}`)}`);
    console.log(`  ${chalk.yellow('Package:')} ${pkgJSON.name}`);
    console.log(`  ${chalk.yellow('Current:')} ${version}`);
    console.log(`  ${chalk.green('Latest:')} ${latest}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj = produce(pkgJSON, (draft: any) => {
      sdkDeps.forEach(([dep, _]) => {
        draft[key][dep] = latest;
      });
    });

    const newFile = JSON.stringify(newObj, null, 2);
    const formatted = await prettier.format(newFile, {
      parser: 'json-stringify',
    });
    const buf = Buffer.from(formatted, 'utf-8');
    await fs.rm(pkgJSONPath);
    await fs.writeFile(pkgJSONPath, buf, 'utf-8');
    return true;
  };
}

async function checkPackages() {
  const pkgsJson = await glob(['package.json', '**/package.json'], {
    cwd: resolve(process.cwd(), '../../'),
    ignore: ['**/node_modules/**'],
  });

  const latestRcVersion = await getLatestRcVersion();
  const check = checkAgainstLatest(latestRcVersion);
  const updated = await Promise.all(
    pkgsJson.map(async (pkgJson) => {
      const pkgJsonPath = resolve(process.cwd(), '../../', pkgJson);
      const deps = await check(pkgJsonPath, 'dependencies');
      const devDeps = await check(pkgJsonPath, 'devDependencies');
      const peerDeps = await check(pkgJsonPath, 'peerDependencies');
      return [deps, devDeps, peerDeps];
    })
  );

  return updated.flat().some(Boolean);
}

async function main() {
  const changed = await checkPackages();
  if (!changed) {
    console.log(chalk.green('All packages are up to date!'));
    return;
  }

  console.log(chalk.yellow('Packages have been updated!'));
  const latest = await getLatestRcVersion();
  const argv = minimist(process.argv.slice(2));
  const token = argv.token ?? TOKEN;
  const repoOwner = 'fuellabs';
  const repoName = 'fuels-wallet';
  const baseBranch = 'master';
  const headBranch = argv['head-branch'] ?? HEAD_BRANCH;

  if (!token) {
    console.error(chalk.red('❌ Missing GITHUB_TOKEN'));
    return;
  }
  if (!headBranch) {
    console.error(chalk.red('❌ Missing HEAD_BRANCH'));
    return;
  }

  const $$ = $({ stdio: 'inherit' });
  await $$`pnpm install`;
  await $$`git config --global user.email "github-actions[bot]@users.noreply.github.com"`;
  await $$`git config --global user.name "github-actions[bot]"`;
  await $$`git checkout -b ${headBranch}`;
  await $$`git add .`;
  await $$`git commit -m "chore: update sdk ${latest}"`;
  await $$`git push --force --set-upstream origin ${headBranch}`;

  const prTitle = `chore: update sdk ${latest}`;
  const prBody = `This PR updates the SDK to the latest version: ${latest}`;
  const res = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/pulls`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title: prTitle,
        body: prBody,
        head: headBranch,
        base: baseBranch,
      }),
    }
  );

  if (!res.ok) {
    console.error(await res.text());
    return;
  }
}

main();
