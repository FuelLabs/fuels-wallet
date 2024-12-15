export interface ContractInfo {
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
let projectsCache: Project[] | undefined;

export async function getContractInfo(
  contractId: string
): Promise<ContractInfo | null> {
  try {
    console.log('Fetching contract info for:', contractId);

    if (projectsCache === undefined) {
      const response = await fetch(PROJECTS_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      projectsCache = (await response.json()) as Project[];
    }

    for (const project of projectsCache) {
      const contracts = [
        ...(project.contracts?.mainnet || []),
        ...(project.contracts?.sepolia || []),
      ];

      const matchingContract = contracts.find(
        (contract) => contract.id.toLowerCase() === contractId.toLowerCase()
      );

      if (matchingContract) {
        console.log('Found contract:', matchingContract);
        return {
          name: matchingContract.name,
          image: `https://raw.githubusercontent.com/FuelLabs/fuel-ecosystem/main/packages/registry/public/logos/${project.image}.png`,
          description: matchingContract.description || project.description,
        };
      }
    }

    console.log('No contract info found for:', contractId);
    return null;
  } catch (error) {
    console.error('Error fetching contract info:', error);
    return null;
  }
}
