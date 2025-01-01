import type { Contract } from '@fuel-wallet/types';
import { db } from '~/systems/Core/utils/database';

export type ContractsInputs = {
  addContracts: {
    data: Contract[];
  };
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ContractService {
  static async getContracts() {
    return db.transaction('r', db.assets, async () => {
      return db.contracts.toArray();
    });
  }
}
