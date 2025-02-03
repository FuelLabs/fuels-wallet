import type { EcosystemProject } from '@fuel-wallet/types';
import { ECOSYSTEM_PROJECTS_URL } from '~/config';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EcosystemService {
  static async fetchProjects() {
    const res = await fetch(ECOSYSTEM_PROJECTS_URL);

    if (res.ok) {
      const data: EcosystemProject[] = await res.json();
      return data;
    }

    return [];
  }
}
