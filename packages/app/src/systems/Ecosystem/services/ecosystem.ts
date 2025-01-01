import type { EcosystemProject } from '@fuel-wallet/types';
import { ECOSYSTEM_PROJECTS_URL } from '~/config';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EcosystemService {
  static async fetchProjects() {
    const data = (await (
      await fetch(ECOSYSTEM_PROJECTS_URL)
    ).json()) as Array<EcosystemProject>;

    return data;
  }
}
