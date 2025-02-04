import type { EcosystemProject } from '@fuel-wallet/types';
import { useEffect, useRef, useState } from 'react';
import { EcosystemService } from '~/systems/Ecosystem/services/ecosystem';
import { getProjectImage } from '~/systems/Ecosystem/utils/getProjectImage';

type ProjectInfo = {
  name?: string;
  image?: string;
  isLoading: boolean;
};

// Cache for project data to prevent repeated fetches
const projectsCache = new Map<string, ProjectInfo>();

export function useEcosystemProject(contractId?: string) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(() => {
    return contractId && projectsCache.has(contractId)
      ? projectsCache.get(contractId)!
      : { isLoading: false };
  });
  const [error, setError] = useState<string>();
  const isFetching = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function fetchProjectInfo() {
      if (!contractId || isFetching.current) return;

      // Check cache first
      if (projectsCache.has(contractId)) {
        setProjectInfo(projectsCache.get(contractId)!);
        return;
      }

      isFetching.current = true;
      setProjectInfo((prev) => ({ ...prev, isLoading: true }));

      try {
        const projects = await EcosystemService.fetchProjects();

        if (!mounted) return;

        if (!projects || !Array.isArray(projects)) {
          const info = { isLoading: false };
          setProjectInfo(info);
          projectsCache.set(contractId, info);
          return;
        }

        let found = false;
        for (const project of projects) {
          if (!project.contracts?.mainnet) continue;

          const contractInfo = project.contracts.mainnet.find(
            (c) => c.id?.toLowerCase() === contractId.toLowerCase()
          );

          if (contractInfo) {
            const info = {
              name: contractInfo.name || project.name,
              image: project.image ? getProjectImage(project.image) : undefined,
              isLoading: false,
            };
            setProjectInfo(info);
            projectsCache.set(contractId, info);
            setError(undefined);
            found = true;
            break;
          }
        }

        if (!found && mounted) {
          const info = { isLoading: false };
          setProjectInfo(info);
          projectsCache.set(contractId, info);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          const info = { isLoading: false };
          setProjectInfo(info);
          projectsCache.set(contractId, info);
        }
      } finally {
        isFetching.current = false;
      }
    }

    fetchProjectInfo();
    return () => {
      mounted = false;
    };
  }, [contractId]);

  return { ...projectInfo, error };
}
