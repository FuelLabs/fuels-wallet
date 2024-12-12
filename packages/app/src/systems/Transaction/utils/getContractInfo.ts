interface ContractInfo {
  name: string;
  image: string;
  description: string;
}

interface Contract {
  id: string;
  name: string;
  description?: string;
}

interface Project {
  name: string;
  image: string;
  description: string;
  contracts?: {
    mainnet?: Contract[];
    sepolia?: Contract[];
  };
}

const PROJECTS_URL = 'https://fuellabs.github.io/fuel-ecosystem/projects.json';
const projectsCache: Project[] | null = null;

export async function getContractInfo(
  contractId: string
): Promise<ContractInfo | null> {
  try {
    if (!projectsCache) {
      const response = await fetch(PROJECTS_URL);
      const projects = (await response.json()) as Project[];

      for (const project of projects) {
        const contracts = [
          ...(project.contracts?.mainnet || []),
          ...(project.contracts?.sepolia || []),
        ];

        const matchingContract = contracts.find(
          (contract) => contract.id.toLowerCase() === contractId.toLowerCase()
        );

        if (matchingContract) {
          return {
            name: matchingContract.name,
            image: `https://raw.githubusercontent.com/FuelLabs/fuel-ecosystem/main/packages/registry/public/logos/${project.image}.png`,
            description: matchingContract.description || project.description,
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching contract info:', error);
    return null;
  }
}
