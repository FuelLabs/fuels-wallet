import type { EcosystemProject } from '@fuel-wallet/types';
import { ECOSYSTEM_PROJECTS_URL } from '~/config';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EcosystemService {
  static async fetchProjects() {
    try {
      const res = await fetch(ECOSYSTEM_PROJECTS_URL);

      if (!res.ok) {
        console.error('Failed to fetch projects:', res.status, res.statusText);
        const text = await res.text();
        console.error('Response text:', text);
        throw new Error(
          `Failed to fetch projects: ${res.status} ${res.statusText}`
        );
      }

      const data: EcosystemProject[] = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching projects:', err);
      throw err;
    }
  }
}
