import type { Account, NetworkData, Vault } from '@fuel-wallet/types';

interface ChromeStorageRow<T> {
  key: string;
  data: T;
}

class ChromeStorageTable<T> {
  constructor(private readonly tableName: string) {
    this.tableName = tableName;
  }

  async get({ key }: { key: string }) {
    const rowsMap = (await chrome?.storage?.local?.get(this.tableName)) || {};
    const rows = rowsMap[this.tableName] || [];

    let foundIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].key === key) {
        foundIndex = i;
        break;
      }
    }
    const found = rows[foundIndex]?.data;

    return {
      data: found,
      key,
      index: foundIndex,
      rows,
    };
  }

  async getAll(): Promise<ChromeStorageRow<T>[]> {
    const rowsMap = (await chrome?.storage?.local?.get(this.tableName)) || {};
    const rows: ChromeStorageRow<T>[] = rowsMap[this.tableName] || [];
    return rows;
  }

  async set({ key, data }: ChromeStorageRow<T>) {
    const { index, rows } = await this.get({ key });

    // update
    if (index !== -1) {
      rows[index] = {
        key,
        data,
      };
    } else {
      // create
      rows.push({
        key,
        data,
      });
    }

    await chrome?.storage?.local?.set({
      [this.tableName]: rows,
    });
  }

  async remove({ key }: { key: string }) {
    const { index, rows } = await this.get({ key });

    if (index !== -1) {
      rows.splice(index, 1);
      await chrome?.storage?.local?.set({
        [this.tableName]: rows,
      });
    }
  }

  async clear() {
    await chrome?.storage?.local?.set({
      [this.tableName]: [],
    });
  }
}

export const chromeStorage = {
  accounts: new ChromeStorageTable<Account>('accounts'),
  networks: new ChromeStorageTable<NetworkData>('networks'),
  vaults: new ChromeStorageTable<Vault>('vaults'),
  clear: () => {
    chrome?.storage?.local?.clear();
  }
};
