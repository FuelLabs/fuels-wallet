import type { Contract, EcosystemProject } from '@fuel-wallet/types';
import { CHAIN_IDS } from 'fuels';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ContractService {
  static formatContractsFromEcosystem(
    projects: EcosystemProject[]
  ): Contract[] {
    return projects.flatMap((project) => {
      if (!project.contracts?.mainnet) {
        return [];
      }

      return project.contracts.mainnet.map((contract) => {
        return {
          chainId: CHAIN_IDS.fuel.mainnet,
          contractId: contract.id,
          name: contract.name,
          image: project.image,
        };
      });
    });
  }
}
