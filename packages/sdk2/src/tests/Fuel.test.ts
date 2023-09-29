import { BaseAssetId } from 'fuels';
import { EventEmitter } from 'stream';

import { Fuel } from '../Fuel';
import { FuelWalletConnector } from '../connectors/FuelWalletConnector';

describe('Fuel', () => {
  test('Add default connectors', async () => {
    const fuel = new Fuel();
    const connectors = await fuel.getConnectors();

    expect(connectors.length).toBeGreaterThan(0);
    expect(connectors[0].metadata.name).toEqual('Fuel Wallet');
  });

  test('Add connector using event of a custom EventBus', async () => {
    const eventBus = new EventEmitter();
    const fuel = new Fuel({
      defaultConnectors: [],
      targetObject: eventBus,
    });
    const connectors = await fuel.getConnectors();

    // Trigger event to add connector
    eventBus.emit('FuelConnector', new FuelWalletConnector());

    expect(connectors.length).toBeGreaterThan(0);
    expect(connectors[0].metadata.name).toEqual('Fuel Wallet');
  });

  test('Add connector using window events', async () => {
    const fuel = new Fuel({
      defaultConnectors: [],
    });
    const connectors = await fuel.getConnectors();

    // Trigger event to add connector
    const event = new CustomEvent('FuelConnector', {
      detail: new FuelWalletConnector(),
    });
    window.dispatchEvent(event);

    expect(connectors.length).toBeGreaterThan(0);
    expect(connectors[0].metadata.name).toEqual('Fuel Wallet');
  });

  test('isConnected', async () => {
    const fuel = new Fuel();
    const isConnected = await fuel.isConnected();
    expect(isConnected).toBeTruthy();
  });

  test('connect', async () => {
    const fuel = new Fuel();
    const isConnected = await fuel.connect();
    expect(isConnected).toBeTruthy();
  });

  test('disconnect', async () => {
    const fuel = new Fuel();
    const isConnected = await fuel.disconnect();
    expect(isConnected).toBeFalsy();
  });

  test('accounts', async () => {
    const fuel = new Fuel();
    const accounts = await fuel.accounts();
    expect(accounts).toEqual([]);
  });

  test('currentAccount', async () => {
    const fuel = new Fuel();
    const currentAccount = await fuel.currentAccount();
    expect(currentAccount).toEqual(null);
  });

  test('addAsset', async () => {
    const fuel = new Fuel();
    const isAdded = await fuel.addAssets([
      {
        name: 'Asset',
        description: '...',
        symbol: 'AST',
        icon: 'ast.png',
        assetId: BaseAssetId,
        networks: [],
      },
    ]);
    expect(isAdded).toEqual(true);
  });

  test('assets', async () => {
    const fuel = new Fuel();
    const assets = await fuel.assets();
    expect(assets.length).toEqual(0);
  });

  test('currentNetwork', async () => {
    const fuel = new Fuel();
    const network = await fuel.currentNetwork();
    expect(network).toBeTruthy();
  });

  test('networks', async () => {
    const fuel = new Fuel();
    const networks = await fuel.networks();
    expect(networks).toEqual([]);
  });

  test('addNetwork', async () => {
    const fuel = new Fuel();
    const isNetworkAdded = await fuel.addNetwork({
      url: 'http....',
      chainId: 0,
    });
    expect(isNetworkAdded).toEqual(true);
  });

  test('addABI', async () => {
    const fuel = new Fuel();
    const isAdded = await fuel.addABI('0x001123', {
      types: [],
      loggedTypes: [],
      functions: [],
      configurables: [],
    });
    expect(isAdded).toEqual(true);
  });

  test('getABI', async () => {
    const fuel = new Fuel();
    const abi = await fuel.getABI('0x001123');
    expect(abi).toStrictEqual(null);
  });

  test('hasABI', async () => {
    const fuel = new Fuel();
    const hasFuel = await fuel.hasABI('0x001123');
    expect(hasFuel).toBeTruthy();
  });
});
