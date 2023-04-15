import type { AbiMap } from '@fuel-wallet/types';

import { db } from '~/systems/Core/utils/database';

export type AbiInputs = {
  addAbi: {
    data: AbiMap;
  };
};

export class AbiService {
  static async addAbi(input: AbiInputs['addAbi']) {
    return db.transaction('rw', db.abis, async () => {
      const abiMap = await AbiService.getAbiMap();
      const dataToAdd = Object.keys(input.data)
        .map((key) => ({
          contractId: key,
          abi: input.data[key],
        }))
        .filter(({ contractId }) => !abiMap[contractId]);
      await db.abis.bulkAdd(dataToAdd);

      return true;
    });
  }

  static async getAbiMap() {
    return db.transaction('r', db.abis, async () => {
      const abis = await db.abis.toArray();
      // convert abis to abiMap
      const abiMap: AbiMap = abis.reduce(
        (prev, abi) => ({
          ...prev,
          [abi.contractId]: abi.abi,
        }),
        {}
      );
      return abiMap;
    });
  }

  static async clearAbis() {
    return db.transaction('rw', db.abis, async () => {
      return db.abis.clear();
    });
  }
}
