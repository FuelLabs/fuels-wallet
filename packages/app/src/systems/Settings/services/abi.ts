import type { AbiMap } from 'fuels';
import { db } from '~/systems/Core/utils/database';

export type AbiInputs = {
  addAbi: {
    data: AbiMap;
  };
  getAbi: {
    data: string;
  };
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AbiService {
  static async addAbi(input: AbiInputs['addAbi']) {
    return db.transaction('rw', db.abis, async () => {
      const dataToAdd = Object.keys(input.data).map((key) => ({
        contractId: key,
        abi: input.data[key],
      }));
      await db.abis.bulkAdd(dataToAdd, undefined, {
        allKeys: true,
      });

      return true;
    });
  }

  static async getAbi(input: AbiInputs['getAbi']) {
    return db.transaction('r', db.abis, async () => {
      const abi = await db.abis.get({ contractId: input.data });
      return abi?.abi;
    });
  }

  static async clearAbis() {
    return db.transaction('rw', db.abis, async () => {
      return db.abis.clear();
    });
  }
}
