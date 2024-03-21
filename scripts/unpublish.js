const { readFile, readdir } = require('node:fs').promises;
const { join } = require('node:path');
const util = require('node:util');
const { compare } = require('compare-versions');
const exec = util.promisify(require('node:child_process').exec);
const { version } = require('../packages/app/package.json');

const DELETE_TAGS = /next|preview|master|rc/;
const CURRENT_VERSION = version;
const DELETE_PACKAGES = process.env.DELETE_PACKAGES === 'true';
const dryRun = DELETE_PACKAGES ? '' : '--dry-run';

async function getPublicPackages() {
  const packages = await readdir(join(__dirname, '../packages'), {
    withFileTypes: true,
  });

  const packagesNames = [];
  for (const p of packages) {
    const file = await readFile(join(p.path, p.name, 'package.json'), 'utf8');
    const pkg = JSON.parse(file.toString());

    console.log(join(p.path, p.name, 'package.json'));
    console.log(pkg.name, pkg.private);

    if (pkg.private) continue;

    packagesNames.push(pkg.name);
  }

  return packagesNames;
}

async function main() {
  console.log('Get public packages');
  const packages = await getPublicPackages();

  for (const packageName of packages) {
    console.log(
      [
        '\n',
        '##############################################',
        `➡️ ${packageName}`,
        '##############################################',
        '\n',
      ].join('\n')
    );
    console.log(`📦 Fetching ${packageName} versions`);
    const { versions } = await fetch(
      `https://registry.npmjs.org/${packageName}`
    ).then((resp) => resp.json());
    const versionsToDelete = Object.keys(versions).filter((version) => {
      // Filter all versions that have tags like next, master, preview but are not related to the current version.
      // This avoids for current WIP versions to be deleted during test.
      return (
        version.search(DELETE_TAGS) > -1 &&
        !compare(version, CURRENT_VERSION, '>=')
      );
    });
    console.log('The following versions will be deleted:');
    console.log(versionsToDelete.map((v) => `   - ${v}`).join('\n'));
    for (const versionDelete of versionsToDelete) {
      console.log(`\n🗑️  Deleting ${packageName}@${versionDelete}...`);
      console.log(dryRun);
      const { stderr } = await exec(
        `npm unpublish ${packageName}@${versionDelete} ${dryRun}`
      );
      if (stderr) {
        console.log(`❌ Error ${packageName}@${versionDelete} not deleted!\n`);
        console.log(stderr);
      } else {
        console.log(`✅ Package ${packageName}@${versionDelete} deleted!\n`);
      }
    }
  }
}

main()
  .then(() => {
    console.log('✅ Packages versions removed successfully');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
