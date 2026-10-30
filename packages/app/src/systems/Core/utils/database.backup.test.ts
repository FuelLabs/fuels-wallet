import type { NetworkData, Vault } from '@fuel-wallet/types';
import { DEVNET_NETWORK_URL } from 'fuels';
import { IGNITION_NETWORK } from '~/networks';
import { MOCK_ACCOUNTS } from '~/systems/Account/__mocks__';
import { AccountService } from '~/systems/Account/services/account';
import { chromeStorage } from '~/systems/Core/services/chromeStorage';
import { db } from './database';

jest.mock('~/systems/Core/services/chromeStorage', () =>
  jest.requireActual('~/systems/Core/services/chromeStorage')
);

// biome-ignore lint/suspicious/noExplicitAny: test storage
type Store = Record<string, any>;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

let chromeStore: Store = {};
const chromeSet = jest.fn(async (items: Store) => {
  Object.assign(chromeStore, clone(items));
});
const chromeGet = jest.fn(async (key: string) =>
  key in chromeStore ? { [key]: clone(chromeStore[key]) } : {}
);

const opfsFiles: Record<string, string> = {};
const opfsWrites = jest.fn();
const opfsRoot = {
  async getFileHandle(name: string, opts?: { create?: boolean }) {
    if (!(name in opfsFiles)) {
      if (!opts?.create) throw new DOMException('missing', 'NotFoundError');
      opfsFiles[name] = '';
    }
    return {
      getFile: async () => ({ text: async () => opfsFiles[name] }),
      createWritable: async () => {
        opfsWrites();
        let buffer = '';
        return {
          write: async (chunk: string) => {
            buffer += chunk;
          },
          close: async () => {
            opfsFiles[name] = buffer;
          },
        };
      },
    };
  },
  async removeEntry(name: string) {
    delete opfsFiles[name];
  },
};

const VAULTS: Vault[] = [{ key: 'vault0', data: 'encrypted-vault-0' }];
const NETWORKS: NetworkData[] = [
  {
    id: 'net-1',
    name: 'Local',
    url: 'http://localhost:4000/v1/graphql',
    chainId: 0,
    isSelected: true,
  },
  {
    id: 'net-2',
    name: 'Testnet',
    url: 'https://testnet.fuel.network/v1/graphql',
    chainId: 0,
  },
];
const DEVNET: NetworkData = {
  id: 'net-devnet',
  name: 'Devnet',
  url: DEVNET_NETWORK_URL,
  chainId: 0,
  isSelected: true,
};
const STALE_ACCOUNT = {
  ...MOCK_ACCOUNTS[2],
  address: `0x${'9'.repeat(64)}`,
  name: 'Removed later',
};

// Storage state a user could have before the sync runs: a row that is no
// longer in the DB, a row with outdated data, and a missing table.
const seedChromeStore = (): Store => ({
  accounts: [
    { key: STALE_ACCOUNT.address, data: STALE_ACCOUNT },
    {
      key: MOCK_ACCOUNTS[0].address,
      data: { ...MOCK_ACCOUNTS[0], name: 'Old name' },
    },
  ],
  networks: [{ key: 'net-1', data: { ...NETWORKS[0], isSelected: false } }],
});

// The sync as it worked before batching: one set() call per row.
async function legacySync() {
  const accounts = await db.accounts.toArray();
  const vaults = await db.vaults.toArray();
  const networks = await db.networks.toArray();
  for (const account of accounts) {
    await chromeStorage.accounts.set({ key: account.address, data: account });
  }
  for (const vault of vaults) {
    await chromeStorage.vaults.set({ key: vault.key, data: vault });
  }
  for (const network of networks) {
    await chromeStorage.networks.set({ key: network.id || '', data: network });
  }
}

describe('FuelDB backup sync', () => {
  beforeAll(() => {
    // biome-ignore lint/suspicious/noExplicitAny: test global
    (global as any).chrome = {
      storage: { local: { get: chromeGet, set: chromeSet } },
    };
    Object.defineProperty(navigator, 'storage', {
      value: { getDirectory: async () => opfsRoot },
      configurable: true,
    });
  });

  beforeEach(async () => {
    await db.accounts.clear();
    await db.vaults.clear();
    await db.networks.clear();
    await db.accounts.bulkAdd(MOCK_ACCOUNTS.slice(0, 2));
    await db.vaults.bulkAdd(VAULTS);
    await db.networks.bulkAdd(NETWORKS);
    for (const name of Object.keys(opfsFiles)) delete opfsFiles[name];
    chromeStore = seedChromeStore();
    chromeSet.mockClear();
    opfsWrites.mockClear();
  });

  it('writes chrome.storage rows identical to the per-row sync', async () => {
    await legacySync();
    const expected = JSON.stringify(chromeStore);
    const legacySetCalls = chromeSet.mock.calls.length;

    chromeStore = seedChromeStore();
    chromeSet.mockClear();
    await db.syncDbToChromeStorage();

    expect(JSON.stringify(chromeStore)).toBe(expected);
    expect(legacySetCalls).toBe(5);
    expect(chromeSet).toHaveBeenCalledTimes(3);
  });

  it('writes the same OPFS backup bytes as before', async () => {
    await db.syncDbToOPFS();
    expect(opfsFiles['backup.json']).toBe(
      JSON.stringify({
        accounts: await db.accounts.toArray(),
        vaults: await db.vaults.toArray(),
        networks: await db.networks.toArray(),
      })
    );
  });

  it('skips chrome.storage and OPFS writes when nothing changed', async () => {
    await db.syncBackups();
    expect(chromeSet).toHaveBeenCalledTimes(3);
    expect(opfsWrites).toHaveBeenCalledTimes(1);

    chromeSet.mockClear();
    opfsWrites.mockClear();
    const syncSpy = jest.spyOn(db, 'syncBackups');
    await db.open();
    expect(syncSpy).toHaveBeenCalledTimes(1);
    await syncSpy.mock.results[0].value;
    syncSpy.mockRestore();
    expect(chromeSet).not.toHaveBeenCalled();
    expect(opfsWrites).not.toHaveBeenCalled();

    await db.accounts.update(MOCK_ACCOUNTS[1].address, { name: 'Renamed' });
    await db.syncBackups();
    expect(chromeSet).toHaveBeenCalledTimes(1);
    expect(chromeSet.mock.calls[0][0]).toHaveProperty('accounts');
    expect(opfsWrites).toHaveBeenCalledTimes(1);
  });

  it('lets wallet recovery read the backups after the DB is lost', async () => {
    const accounts = await db.accounts.toArray();
    const vaults = await db.vaults.toArray();
    const networks = await db.networks.toArray();
    await db.syncBackups();

    await db.accounts.clear();
    await db.vaults.clear();
    await db.networks.clear();

    const state = await AccountService.fetchRecoveryState();
    expect(state.needsRecovery).toBe(true);
    expect(state.needsAccRecovery).toBe(true);
    expect(state.needsVaultRecovery).toBe(true);
    expect(state.needsNetworkRecovery).toBe(true);

    const backupAccounts = state.chromeStorageBackupData.accounts.map(
      (row) => row.data
    );
    expect(backupAccounts).toEqual(expect.arrayContaining(clone(accounts)));
    expect(state.chromeStorageBackupData.vaults.map((row) => row.data)).toEqual(
      clone(vaults)
    );
    expect(
      state.chromeStorageBackupData.networks.map((row) => row.data)
    ).toEqual(clone(networks));
    expect(state.opfsBackupData).toEqual(clone({ accounts, vaults, networks }));
  });

  it('drops the devnet row that v31 removed from the DB', async () => {
    chromeStore.networks.push({ key: DEVNET.id, data: DEVNET });

    await db.syncDbToChromeStorage();

    expect(chromeStore.networks.map((row: { key: string }) => row.key)).toEqual(
      ['net-1', 'net-2']
    );
  });

  it('skips devnet and selects another network when recovering', async () => {
    chromeStore.networks = [
      { key: DEVNET.id, data: DEVNET },
      { key: NETWORKS[1].id, data: NETWORKS[1] },
    ];
    await db.accounts.clear();
    await db.vaults.clear();
    await db.networks.clear();
    chromeStore.vaults = VAULTS.map((vault) => ({
      key: vault.key,
      data: vault,
    }));

    await AccountService.recoverWallet();

    expect(await db.networks.toArray()).toEqual([
      { ...NETWORKS[1], isSelected: true },
    ]);
  });

  it('adds Ignition when devnet was the only backed-up network', async () => {
    chromeStore.networks = [{ key: DEVNET.id, data: DEVNET }];
    await db.accounts.clear();
    await db.vaults.clear();
    await db.networks.clear();

    await AccountService.recoverWallet();

    const networks = await db.networks.toArray();
    expect(networks).toHaveLength(1);
    expect(networks[0]).toMatchObject({
      url: IGNITION_NETWORK.url,
      isSelected: true,
    });
  });
});

describe('FuelDB network backup', () => {
  const REMOVED: NetworkData = {
    id: 'net-0-removed',
    name: 'Removed node',
    url: 'https://removed.node/v1/graphql',
    chainId: 0,
    isSelected: true,
  };

  beforeAll(() => {
    // biome-ignore lint/suspicious/noExplicitAny: test global
    (global as any).chrome = {
      storage: { local: { get: chromeGet, set: chromeSet } },
    };
  });

  beforeEach(async () => {
    await db.accounts.clear();
    await db.vaults.clear();
    await db.networks.clear();
    await db.accounts.bulkAdd(MOCK_ACCOUNTS.slice(0, 2));
    await db.vaults.bulkAdd(VAULTS);
    await db.networks.bulkAdd(NETWORKS);
    chromeStore = {};
  });

  it('drops a network from the backup once it is removed', async () => {
    await db.networks.add({ ...REMOVED, isSelected: false });
    await db.syncDbToChromeStorage();
    await db.networks.delete(REMOVED.id as string);

    await db.syncDbToChromeStorage();

    expect(chromeStore.networks.map((row: { key: string }) => row.key)).toEqual(
      ['net-1', 'net-2']
    );
  });

  it('recovers exactly one selected network from an older backup', async () => {
    chromeStore = {
      vaults: VAULTS.map((vault) => ({ key: vault.key, data: vault })),
      networks: [
        { key: REMOVED.id, data: REMOVED },
        { key: NETWORKS[0].id, data: NETWORKS[0] },
      ],
    };
    await db.accounts.clear();
    await db.vaults.clear();
    await db.networks.clear();

    await AccountService.recoverWallet();

    const selected = (await db.networks.toArray()).filter(
      (network) => network.isSelected
    );
    expect(selected).toHaveLength(1);
  });
});
