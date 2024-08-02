import type { StoredFuelWalletError } from '@fuel-wallet/types';
import { db } from '~/systems/Core/utils/database';

export class ErrorProcessorService {
  private errorBuffer: StoredFuelWalletError[] = [];
  private debounceTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.setupListeners();
    this.debounceProcess();
  }

  private setupListeners() {
    db.errors.hook('creating', (_primKey, _errorData, _transaction) => {
      this.debounceProcess();
    });
  }

  private debounceProcess() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(async () => {
      await this.processErrors();
    }, 1000);
  }

  private async processErrors() {
    const errorsData = await db.errors.toArray();
    const filteredErrorsByMessage: Record<string, StoredFuelWalletError> = {};
    const removedKeys = [];
    for (const data of errorsData) {
      const foundError = filteredErrorsByMessage[data.error.message];
      if (foundError) {
        foundError.extra.counts = (foundError.extra.counts || 0) + 1;
        removedKeys.push(data.id);
        db.errors.update(foundError.id, foundError);
        continue;
      }

      filteredErrorsByMessage[data.error.message] = data;
    }

    if (removedKeys.length) {
      db.errors.bulkDelete(removedKeys);
    }
  }
}
