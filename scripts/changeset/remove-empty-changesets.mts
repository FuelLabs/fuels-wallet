import { unlinkSync } from 'node:fs';
import { join } from 'node:path';
import readChangesets from '@changesets/read';

const changesets = await readChangesets(process.cwd());

for (const changeset of changesets) {
  if (changeset.releases.length > 0) continue;
  const file = join('.changeset', `${changeset.id}.md`);
  console.log(`Removing empty changeset ${file}`);
  unlinkSync(file);
}
