import { Octokit } from 'octokit';

const { GITHUB_TOKEN } = process.env;

if (!GITHUB_TOKEN) {
  throw new Error('Token not provided');
}

const api = new Octokit({ auth: process.env.GITHUB_TOKEN });

export class Github {
  constructor(
    private owner: string,
    private repo: string
  ) {}

  async getClosedPullRequests({
    base,
    head,
  }: {
    base?: string;
    head?: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pulls: any[] = await api.rest.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: 'closed',
      base,
      head,
    });
    return pulls?.map((pull) => pull.url);
  }
}
