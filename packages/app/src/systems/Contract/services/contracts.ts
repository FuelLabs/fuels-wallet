import type { Contract, EcosystemProject } from '@fuel-wallet/types';
import { CHAIN_IDS } from 'fuels';
import { db } from '~/systems/Core/utils/database';

export type ContractsInputs = {
  addContracts: {
    data: Contract[];
  };
};

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
          image: project.image ?? '', // @TODO: Add url with network explorerUrl
        };
      });
    });
  }

  static async getContracts() {
    return db.transaction('r', db.assets, async () => {
      return db.contracts.toArray();
    });
  }
}
