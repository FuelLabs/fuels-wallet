import { createUUID } from '@fuel-wallet/connections';
import type Dexie from 'dexie';
import { CHAIN_IDS, DEVNET_NETWORK_URL, TESTNET_NETWORK_URL } from 'fuels';

export const applyDbVersioning = (db: Dexie) => {
  db.version(19)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name',
      connections: 'origin',
      transactions: '&id',
      assets: '&assetId, &name, &symbol',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      const networks = tx.table('networks');

      // Clean networks
      await networks.clear();

      // Insert testnet  network
      await networks.add({
        chainId: CHAIN_IDS.fuel.testnet,
        name: 'Fuel Sepolia Testnet',
        url: TESTNET_NETWORK_URL,
        isSelected: true,
        id: createUUID(),
      });

      // Insert devnet network
      await networks.add({
        chainId: CHAIN_IDS.fuel.devnet,
        name: 'Fuel Ignition Sepolia Devnet',
        url: DEVNET_NETWORK_URL,
        isSelected: false,
        id: createUUID(),
      });
    });
};
