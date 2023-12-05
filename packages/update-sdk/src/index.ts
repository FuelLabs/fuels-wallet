/* eslint-disable no-console */
import chalk from 'chalk';
import { compare } from 'compare-versions';
import { glob } from 'glob';
import { produce } from 'immer';
import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import packageJson from 'package-json';
import prettier from 'prettier';

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
  const checked = await checkPackages();
  if (!checked) {
    console.log(
      `\n${chalk.green('All packages are up to date with latest SDK')}`
    );
    return;
  }

  const latestVersion = await getLatestRcVersion();
  console.log(
    `\n${chalk.green('All packages updated to latest SDK:')} ${latestVersion}`
  );

  // Output the latest version for GitHub Actions
  console.log(`::set-output name=latest_version::${latestVersion}`);
}

main();
