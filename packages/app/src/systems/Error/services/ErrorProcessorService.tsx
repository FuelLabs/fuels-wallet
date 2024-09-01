import type { StoredFuelWalletError } from '@fuel-wallet/types';
import { db } from '~/systems/Core/utils/database';

export class ErrorProcessorService {
  constructor() {
    this.processErrors();
  }

  async processErrors() {
    const errorsData = await db.errors.toArray();
    const filteredErrorsByMessage: Record<string, StoredFuelWalletError> = {};
    const removedKeys = [];
    const bulkUpdates: Array<Promise<unknown>> = [];
    for (const data of errorsData) {
      const foundError = filteredErrorsByMessage[data.error.message];
      if (foundError) {
        foundError.extra.counts = (foundError.extra.counts || 0) + 1;
        removedKeys.push(data.id);
        bulkUpdates.push(db.errors.update(foundError.id, foundError));
        continue;
      }

      filteredErrorsByMessage[data.error.message] = data;
    }

    await Promise.all(bulkUpdates);

    if (removedKeys.length) {
      await db.errors.bulkDelete(removedKeys);
    }
  }
}
