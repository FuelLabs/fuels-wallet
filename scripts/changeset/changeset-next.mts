import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CHANGESET_CONFIG_PATH = '.changeset/config.json';

interface PackageInfo {
  path: string;
  contents: {
    name: string;
    private?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Recursively find all package.json files
 */
function findPackageJsonFiles(
  dir: string,
  ignorePatterns: string[] = ['dist', 'node_modules']
): string[] {
  const files: string[] = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);

      // Skip ignored directories
      if (ignorePatterns.some((pattern) => fullPath.includes(pattern))) {
        continue;
      }

      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findPackageJsonFiles(fullPath, ignorePatterns));
      } else if (item === 'package.json') {
        files.push(fullPath);
      }
    }
  } catch {
    // Skip directories we can't read
  }

  return files;
}

/**
 * Gather all the package.json files to be published
 */
const packageFiles = findPackageJsonFiles('.');

const packages: PackageInfo[] = packageFiles
  // Read in the package.json file
  .map((fileName: string) => {
    const packageJson = JSON.parse(readFileSync(fileName, 'utf-8'));
    return {
      path: fileName,
      contents: packageJson,
    };
  })
  // Filter out private packages (except templates if any)
  .filter(
    (pkg: PackageInfo) =>
      !pkg.contents.private || pkg.path.includes('templates')
  );

// Update all "private" `package.json` files to be public
const privatePackages = packages.filter(
  (pkg: PackageInfo) => pkg.contents.private
);
for (const pkg of privatePackages) {
  const contents = { ...pkg.contents, private: false };
  writeFileSync(pkg.path, JSON.stringify(contents, null, 2));
  execSync(`git add ${pkg.path}`);
}

/**
 * Update the changeset config to include the @nelitow-fuel organization scope
 */
const packageNames = packages.map((pkg: PackageInfo) => pkg.contents.name);
const changesetConfigContents = JSON.parse(
  readFileSync(CHANGESET_CONFIG_PATH, 'utf-8')
);
const changesetConfig = {
  ...changesetConfigContents,
  ignore: [
    ...changesetConfigContents.ignore.filter(
      (ignorePackageName: string) => !packageNames.includes(ignorePackageName)
    ),
  ],
};
writeFileSync(CHANGESET_CONFIG_PATH, JSON.stringify(changesetConfig, null, 2));
execSync(`git add ${CHANGESET_CONFIG_PATH}`);

/**
 * Add a changeset to bump all package versions
 */
const packagesToBump = packages.map(
  (pkg: PackageInfo) => `"${pkg.contents.name}": patch`
);
const output = `---\n${packagesToBump.join('\n')}\n---\n\nincremental\n`;
writeFileSync('.changeset/fuel-wallet-ci.md', output);
execSync('git add .changeset/fuel-wallet-ci.md');
