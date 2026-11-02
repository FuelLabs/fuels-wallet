import Dexie from 'dexie';
import { DEVNET_NETWORK_URL } from 'fuels';
import { IGNITION_NETWORK } from '~/networks';

import { applyDbVersioning } from './databaseVersioning';

const V30_STORES = {
  vaults: 'key',
  accounts: '&address, &name',
  networks: '&id, &url, &name, chainId',
  connections: 'origin',
  transactionsCursors: '++id, address, size, providerUrl, endCursor',
  assets: '&name, &symbol',
  indexedAssets: 'key, fetchedAt',
  abis: '&contractId',
  errors: '&id',
};

async function seedV30(name: string, networks: Array<object>) {
  const db = new Dexie(name);
  db.version(30).stores(V30_STORES);
  await db.table('networks').bulkAdd(networks);
  db.close();
}

async function upgrade(name: string) {
  const db = new Dexie(name);
  applyDbVersioning(db);
  await db.open();
  const networks = await db.table('networks').toArray();
  db.close();
  return networks;
}

describe('DB version 31', () => {
  it('removes devnet and selects mainnet when devnet was selected', async () => {
    await seedV30('v31-selected', [
      { ...IGNITION_NETWORK, id: '0', isSelected: false },
      { id: '2', name: 'Devnet', url: DEVNET_NETWORK_URL, isSelected: true },
    ]);
    const networks = await upgrade('v31-selected');
    expect(networks.map((n) => n.id)).toEqual(['0']);
    expect(networks[0].isSelected).toBe(true);
  });

  it('keeps the current selection when devnet was not selected', async () => {
    await seedV30('v31-unselected', [
      { ...IGNITION_NETWORK, id: '0', isSelected: false },
      {
        id: '1',
        name: 'Local',
        url: 'http://localhost:4000/v1/graphql',
        isSelected: true,
      },
      { id: '2', name: 'Devnet', url: DEVNET_NETWORK_URL, isSelected: false },
    ]);
    const networks = await upgrade('v31-unselected');
    expect(networks.map((n) => [n.id, n.isSelected])).toEqual([
      ['0', false],
      ['1', true],
    ]);
  });
});
