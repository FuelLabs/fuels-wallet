/* eslint-disable no-console */
import c from 'chalk';

import { Github } from './Github';
import { NpmPackage } from './NpmPackage';
import { PackageJson } from './PackageJson';

export class ReleaseBot {
  private git!: Github;

  constructor(
    private owner: string,
    private repo: string
  ) {
    this.git = new Github(owner, repo);
  }

  async release() {
    const versions = await this._getUnreleasedVersions();
    if (!versions.length) {
      console.log(c.green('✅ No unreleased versions found'));
      return;
    }

    const currentBranch = await this.git.getCurrentBranch();
    console.log(c.yellow(`\n🔎 Found ${versions.length} unreleased versions:`));
    console.log(c.yellow(`   - ${versions.join('\n   - ')}`));

    for (const version of versions) {
      try {
        await this._newReleaseBranch(version);
        await this._updateDependencies(version);
        await this._pushNewVersion(version);
        await this.git.checkoutBranch(currentBranch);
      } catch (e) {
        console.log(c.red(`❌ Error releasing ${version}`));
        console.log(e);
        await this.git.checkoutBranch(currentBranch);
        await this._deleteBranch(version);
      }
    }
  }

  private async _newReleaseBranch(version: string) {
    const branchName = this._sdkBranchName(version);
    console.log(c.white(`\n🔀 Creating branch ${branchName}`));
    await this.git.checkoutBranch(branchName);
  }

  private async _updateDependencies(version: string) {
    const matcher = (dep: string) => /^(fuels)|(@fuel-ts)/.test(dep);
    await PackageJson.updateAllDependencies(version, matcher);
  }

  private async _pushNewVersion(version: string) {
    const branchName = this._sdkBranchName(version);
    const commitMessage = `feat: updating sdk to ${version}`;

    await this.git.pushingFromStage(commitMessage);
    await this.git.createPullRequest({
      base: 'master',
      head: branchName,
      title: `feat: updating sdk to ${version}`,
      body: `✨ This PR updates the SDK to version [${version}](https://www.npmjs.com/package/fuels/v/${version})`,
    });
  }

  private async _deleteBranch(version: string) {
    const branchName = this._sdkBranchName(version);
    await this.git.deleteBranch(branchName);
  }

  private async _getUnreleasedVersions(): Promise<string[]> {
    const versions = await this._getRcVersions();
    const filtered: string[] = [];
    const github = new Github(this.owner, this.repo);
    for (const version of versions) {
      const rcBranch = this._sdkBranchName(version);
      const opened = await github.getOpenedPullRequests({
        base: 'master',
        head: rcBranch,
      });
      const merged = await github.getMergedPullRequests({
        base: 'master',
        head: rcBranch,
      });

      console.log({ version, opened, merged });
      if (!opened.length && !merged.length) {
        filtered.push(version);
      }
    }
    console.log({ filtered });
    return filtered;
  }

  private async _getRcVersions(): Promise<string[]> {
    console.log(c.cyan('⌛️ Fetching new RC versions...'));
    const pkg = new NpmPackage('fuels');
    return pkg.getVersions({ version: /rc-/ });
  }

  private _sdkBranchName(version: string) {
    return `sdk-update/${version}`;
  }
}
