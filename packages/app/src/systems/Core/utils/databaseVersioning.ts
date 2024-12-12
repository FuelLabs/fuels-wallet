import { createUUID } from '@fuel-wallet/connections';
import type Dexie from 'dexie';
import {
  Address,
  CHAIN_IDS,
  DEVNET_NETWORK_URL,
  TESTNET_NETWORK_URL,
} from 'fuels';
import { DEFAULT_NETWORKS } from '~/networks';

export const applyDbVersioning = (db: Dexie) => {
  // DB VERSION 19
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
      // *
      // upgrades network tables to have chainId field
      // *
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

  // DB VERSION 20
  db.version(20)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name',
      connections: 'origin',
      transactions: '&id',
      assets: null,
      assetsTemp: '++id',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      // *
      // transfer from asset table to assetTemp, to delete asset and create new with other pkey
      // *
      const assets = await tx.table('assets').toArray();
      await tx.table('assetsTemp').bulkAdd(assets);
    });

  // DB VERSION 21
  db.version(21)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name',
      connections: 'origin',
      transactions: '&id',
      assets: '&name, &symbol',
      assetsTemp: null,
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      // *
      // transfer from assetTemp table to asset, but now asset is created not including the "assetId" pkey
      // *
      const assets = tx.table('assets');
      const assetsTemp = tx.table('assetsTemp');

      // Clean assets
      await assets.clear();

      // Insert assets
      await assets.bulkAdd(await assetsTemp.toArray());
    });

  // DB VERSION 22
  db.version(22)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name, chainId',
      connections: 'origin',
      transactions: '&id',
      assets: '&name, &symbol',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      const networks = tx.table('networks');
      // *
      // Drop all networks
      // *
      await networks.clear();
      // *
      // Add default networks
      // *
      for (const [index, network] of DEFAULT_NETWORKS.entries()) {
        if (network.hidden) continue;

        await networks.add({
          // Ensure we add to database in the same order as the DEFAULT_NETWORKS
          id: index.toString(),
          ...network,
        });
      }
    });

  // DB VERSION 23
  // 1. Drop transactions table since we don't use that anymore
  // 2. Add cursors table for handling tx pagination
  db.version(23).stores({
    vaults: 'key',
    accounts: '&address, &name',
    networks: '&id, &url, &name, chainId',
    connections: 'origin',
    transactions: null,
    transactionsCursors: '++id, address, providerUrl, endCursor',
    assets: '&name, &symbol',
    abis: '&contractId',
    errors: '&id',
  });

  // DB VERSION 24
  // Add transactionCursors page size column
  db.version(24)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name, chainId',
      connections: 'origin',
      transactionsCursors: '++id, address, size, providerUrl, endCursor',
      assets: '&name, &symbol',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      const transactionsCursors = tx.table('transactionsCursors');
      await transactionsCursors.clear();
    });

  // DB VERSION 25
  // Update accounts to use checksum address
  db.version(25)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name, chainId',
      connections: 'origin',
      transactionsCursors: '++id, address, size, providerUrl, endCursor',
      assets: '&name, &symbol',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      const accountsTable = tx.table('accounts');
      const accounts = await accountsTable.toArray();
      const updatedAccounts = accounts.map((account) => ({
        ...account,
        address: Address.fromString(account.address).toChecksum(),
      }));
      await accountsTable.clear();
      await accountsTable.bulkAdd(updatedAccounts);
    });

  // DB VERSION 26
  // cleanup networks and add defaults
  db.version(26)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name, chainId',
      connections: 'origin',
      transactionsCursors: '++id, address, size, providerUrl, endCursor',
      assets: '&name, &symbol',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      const networks = tx.table('networks');
      // *
      // Drop all networks
      // *
      await networks.clear();
      // *
      // Add default networks
      // *
      for (const [index, network] of DEFAULT_NETWORKS.entries()) {
        if (network.hidden) continue;

        await networks.add({
          // Ensure we add to database in the same order as the DEFAULT_NETWORKS
          id: index.toString(),
          ...network,
        });
      }
    });

  // DB VERSION 27
  // add indexedAssets table
  db.version(27).stores({
    vaults: 'key',
    accounts: '&address, &name',
    networks: '&id, &url, &name, chainId',
    connections: 'origin',
    transactionsCursors: '++id, address, size, providerUrl, endCursor',
    assets: '&name, &symbol',
    indexedAssets: 'key',
    abis: '&contractId',
    errors: '&id',
  });

  // DB VERSION 28
  // add fetchedAt column to indexedAssets table
  db.version(28).stores({
    vaults: 'key',
    accounts: '&address, &name',
    networks: '&id, &url, &name, chainId',
    connections: 'origin',
    transactionsCursors: '++id, address, size, providerUrl, endCursor',
    assets: '&name, &symbol',
    indexedAssets: 'key, fetchedAt',
    abis: '&contractId',
    errors: '&id',
  });
};
