import axios from 'axios';
import { Agent as HttpAgent } from 'node:http';
import { Agent as HttpsAgent } from 'node:https';
import registryUrl from 'registry-url';

const agentOptions = {
  keepAlive: true,
  maxSockets: 50,
};

const httpAgent = new HttpAgent(agentOptions);
const httpsAgent = new HttpsAgent(agentOptions);

export class NpmPackage {
  constructor(private name: string) {}
  async getVersions(options: { version: RegExp } = { version: /latest/ }) {
    const scope = this.name.split('/')[0];
    const packageUrl = new URL(
      encodeURIComponent(this.name).replace(/^%40/, '@'),
      registryUrl(scope)
    );
    const headers = {
      accept:
        'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
    };

    const fetchOpts = {
      headers,
      agent: {
        http: httpAgent,
        https: httpsAgent,
      },
    };

    const res = await axios(packageUrl.toString(), fetchOpts);
    const data = res.data;
    const { version } = options;
    const versions = Object.keys(data['dist-tags']);
    const filtered = versions.filter((s) => version.test(s));

    return filtered.map((v: string) => {
      const item = data['dist-tags']?.[v];
      return item;
    });
  }
}
