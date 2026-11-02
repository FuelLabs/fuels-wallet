#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { error } from 'node:console';
import { existsSync } from 'node:fs';

(() => {
  try {
    /**
     * This is the base command that has to run always.
     *
     * Release CIs were failing when there were only empty changesets
     * because we weren't running this command.
     *
     * See more here:
     *  https://github.com/FuelLabs/fuels-ts/pull/1847
     */
    execSync('changeset version');

    /**
     * Since fuels-wallet doesn't have a versions package like fuels-ts,
     * we'll skip the versions rebuild but could add other post-version tasks here.
     * For example, if you had documentation or other files that need updating
     * after version changes, you could add those commands here.
     */

    // Example: If you had a docs build step that depends on package versions
    // execSync('pnpm build:docs');

    // Check if any files were modified by changeset version that need committing
    const statusOutput = execSync('git status --porcelain').toString().trim();

    if (statusOutput) {
      // Add any modified files (package.json, CHANGELOG.md files, etc.)
      execSync('git add .');
      execSync('git commit -m"ci(scripts): update versions"');
    }
  } catch (err) {
    error((err as Error).toString());
    process.exit(1);
  }
})();
