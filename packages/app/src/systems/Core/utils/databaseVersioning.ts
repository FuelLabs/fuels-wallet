import { createUUID } from '@fuel-wallet/connections';
import type Dexie from 'dexie';
import {
  Address,
  CHAIN_IDS,
  DEVNET_NETWORK_URL,
  TESTNET_NETWORK_URL,
} from 'fuels';
import { DEFAULT_NETWORKS } from '~/networks';

function bech32ToHex(bech32Address: string): string {
  // Remove the 'fuel' prefix
  const withoutPrefix = bech32Address.slice(4);

  // Base32 alphabet used by bech32
  const ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

  // Convert base32 to bytes
  let value = 0;
  let bits = 0;
  const bytes: number[] = [];

  // Skip the first character (it's a separator)
  for (let i = 1; i < withoutPrefix.length; i++) {
    const char = withoutPrefix[i];
    const digit = ALPHABET.indexOf(char.toLowerCase());

    // Shift left by 5 bits and add the new digit
    value = (value << 5) | digit;
    bits += 5;

    // Extract complete bytes
    while (bits >= 8) {
      bytes.push((value >> (bits - 8)) & 0xff);
      bits -= 8;
      value &= (1 << bits) - 1; // Clear the bits we just extracted
    }
  }

  // Take only the first 32 bytes (64 hex characters)
  const hex = bytes
    .slice(0, 32)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Add 0x prefix
  return `0x${hex}`;
}

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
      // check if has bech32 address first
      const hasBech32Address = accounts.some((account) =>
        account.address.startsWith('fuel')
      );
      if (hasBech32Address) {
        const updatedAccounts = accounts.map((account) => {
          if (!account.address.startsWith('fuel')) return account;

          const hexAddress = bech32ToHex(account.address);

          return {
            ...account,
            address: hexAddress,
          };
        });
        await accountsTable.clear();
        await accountsTable.bulkAdd(updatedAccounts);
      }
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

  // DB VERSION 29
  // Make sure accounts are checksum addresses
  db.version(29)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name, chainId',
      connections: 'origin',
      transactionsCursors: '++id, address, size, providerUrl, endCursor',
      assets: '&name, &symbol',
      indexedAssets: 'key, fetchedAt',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      const accountsTable = tx.table('accounts');
      const accounts = await accountsTable.toArray();
      // check if has bech32 address first
      const hasBech32Address = accounts.some((account) =>
        account.address.startsWith('fuel')
      );
      if (hasBech32Address) {
        const updatedAccounts = accounts.map((account) => {
          if (!account.address.startsWith('fuel')) return account;

          const hexAddress = bech32ToHex(account.address);

          return {
            ...account,
            address: hexAddress,
          };
        });
        await accountsTable.clear();
        await accountsTable.bulkAdd(updatedAccounts);
      }
    });

  // DB VERSION 30
  // Update devnet chainId from 0 to 1119889111
  // This migration handles existing wallets that have devnet stored with old chainId
  db.version(30)
    .stores({
      vaults: 'key',
      accounts: '&address, &name',
      networks: '&id, &url, &name, chainId',
      connections: 'origin',
      transactionsCursors: '++id, address, size, providerUrl, endCursor',
      assets: '&name, &symbol',
      indexedAssets: 'key, fetchedAt',
      abis: '&contractId',
      errors: '&id',
    })
    .upgrade(async (tx) => {
      console.log('[DB Migration v30] Updating devnet chainId');
      const networks = tx.table('networks');

      // Find devnet by URL (more reliable than old chainId since chainId is changing)
      const allNetworks = await networks.toArray();
      const devnetNetwork = allNetworks.find(
        (network) => network.url === DEVNET_NETWORK_URL
      );

      if (devnetNetwork) {
        // Update the chainId to the new value
        await networks.update(devnetNetwork.id, {
          chainId: CHAIN_IDS.fuel.devnet, // New chainId: 1119889111
        });
        console.log(
          `[DB Migration v30] Updated devnet from chainId ${devnetNetwork.chainId} to ${CHAIN_IDS.fuel.devnet}`
        );
      } else {
        console.log('[DB Migration v30] No devnet network found to migrate');
      }
    });
};
