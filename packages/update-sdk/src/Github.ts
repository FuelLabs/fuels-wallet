/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { createTokenAuth } from '@octokit/auth-token';
import { Octokit as GithubOctokit } from '@octokit/core';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import c from 'chalk';
import { $ } from 'execa';
import { resolve } from 'node:path';

const Octokit = GithubOctokit.plugin(restEndpointMethods);

export class Github {
  constructor(
    private owner: string,
    private repo: string
  ) {}

  async getMergedPullRequests({
    base,
    head,
  }: {
    base?: string;
    head?: string;
  }) {
    const api = await this.getApi();
    try {
      const { data: pulls }: { data: any[] } = await api.rest.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state: 'closed',
        base,
        head,
      });

      const numbers = pulls?.map((pull) => pull.number);
      const closed: string[] = [];

      for (const number of numbers) {
        try {
          const { data: pull }: { data: any } = await api.rest.pulls.get({
            owner: this.owner,
            repo: this.repo,
            pull_number: number,
          });

          const { merged_at: mergedAt } = pull;
          const headRef = pull.head.ref;
          if (mergedAt && headRef === head) {
            closed.push(number);
          }
        } catch (e) {
          console.error(e);
        }
      }
      return closed;
    } catch (e: any) {
      console.error(e);
      if (e.status !== 404) {
        throw e;
      }
      return [];
    }
  }

  async getOpenedPullRequests({
    base,
    head,
  }: {
    base?: string;
    head?: string;
  }) {
    const api = await this.getApi();
    try {
      const { data: pulls }: { data: any[] } = await api.rest.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state: 'open',
        base,
        head,
      });
      const filtered = pulls?.filter((pull) => pull.head.ref === head);
      return filtered?.map((pull) => pull.number);
    } catch (e: any) {
      console.error(e);
      if (e.status !== 404) {
        throw e;
      }
      return [];
    }
  }

  async getCurrentBranch() {
    const { stdout } = await $`git branch --show-current`;
    return stdout;
  }

  async checkoutBranch(branchName: string) {
    const cwd = resolve(process.cwd(), '../../');
    const $$ = $({ cwd });
    let branchExists = false;
    try {
      await $$`git show-ref --heads | grep ${branchName}`;
      branchExists = true;
    } catch (e) {
      branchExists = false;
    }

    if (branchExists) {
      await $$`git checkout ${branchName}`;
    } else {
      await $$`git checkout -b ${branchName}`;
    }
  }

  async pushingFromStage(commit: string) {
    const cwd = resolve(process.cwd(), '../../');
    const $$ = $({ cwd });
    await $$`git add .`;
    await $$`git restore --staged .lintstagedrc`;
    await $$`git commit -m ${commit}`;
    await $$`git push origin --force`;
  }

  async createPullRequest({
    base,
    head,
    title,
    body,
  }: {
    base: string;
    head: string;
    title: string;
    body: string;
  }) {
    console.log(c.white(`📤 Pushing branch ${head}`));
    const cwd = resolve(process.cwd(), '../../');
    const $$ = $({ cwd });
    await $$`gh repo set-default ${this.owner}/${this.repo}`;
    const { stdout } =
      await $$`gh pr create --base ${base} --head ${head} --title ${title} --body ${body}`;
    console.log(c.green(`✅ PR created: ${stdout}`));
  }

  async deleteBranch(branchName: string) {
    console.log(c.white(`🗑 Deleting branch ${branchName}`));
    const cwd = resolve(process.cwd(), '../../');
    const $$ = $({ cwd });
    await $$`git branch -D ${branchName}`;
    await $$`git push origin --delete ${branchName}`;
  }

  private async getApi() {
    await $`git config --global user.email "github-actions[bot]@users.noreply.github.com"`;
    await $`git config --global user.name "github-actions[bot]"`;
    await $`git config --global push.autoSetupRemote true`;

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('Missing GITHUB_TOKEN');
    }

    const auth = createTokenAuth(token);
    const authentication = await auth();
    if (authentication.type !== 'token') {
      throw new Error('Invalid token');
    }
    return new Octokit({ auth: authentication.token });
  }
}
