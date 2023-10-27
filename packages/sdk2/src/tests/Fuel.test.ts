import { BaseAssetId } from 'fuels';
import { EventEmitter } from 'stream';

import { Fuel } from '../Fuel';
import { TARGET_FUEL_CONNECTOR_EVENT } from '../FuelConnectorAPI';

import { FuelWalletConnector } from './MockFuelWalletConnector';

describe('Fuel', () => {
  test('Add connector using event of a custom EventBus', async () => {
    const eventBus = new EventEmitter();
    const fuel = new Fuel({
      targetObject: eventBus,
    });
    const connectors = await fuel.getConnectors();

    // Trigger event to add connector
    eventBus.emit(TARGET_FUEL_CONNECTOR_EVENT, new FuelWalletConnector());

    expect(connectors.length).toBeGreaterThan(0);
    expect(connectors[0].metadata.name).toEqual('Fuel Wallet');
  });

  test('Add connector using window events', async () => {
    const fuel = new Fuel();
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
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const isConnected = await fuel.isConnected();
    expect(isConnected).toBeTruthy();
  });

  test('connect', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const isConnected = await fuel.connect();
    expect(isConnected).toBeTruthy();
  });

  test('disconnect', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const isConnected = await fuel.disconnect();
    expect(isConnected).toBeFalsy();
  });

  test('accounts', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const accounts = await fuel.accounts();
    expect(accounts).toEqual([]);
  });

  test('currentAccount', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const currentAccount = await fuel.currentAccount();
    expect(currentAccount).toEqual(null);
  });

  test('addAsset', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
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
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const assets = await fuel.assets();
    expect(assets.length).toEqual(0);
  });

  test('currentNetwork', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const network = await fuel.currentNetwork();
    expect(network).toBeTruthy();
  });

  test('networks', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const networks = await fuel.networks();
    expect(networks).toEqual([]);
  });

  test('addNetwork', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const isNetworkAdded = await fuel.addNetwork({
      url: 'http....',
      chainId: 0,
    });
    expect(isNetworkAdded).toEqual(true);
  });

  test('switchNetwork', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const isNetworkAdded = await fuel.switchNetwork({
      url: 'http....',
      chainId: 0,
    });
    expect(isNetworkAdded).toEqual(true);
  });

  test('addABI', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const isAdded = await fuel.addABI('0x001123', {
      types: [],
      loggedTypes: [],
      functions: [],
      configurables: [],
    });
    expect(isAdded).toEqual(true);
  });

  test('getABI', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const abi = await fuel.getABI('0x001123');
    expect(abi).toStrictEqual(null);
  });

  test('hasABI', async () => {
    const fuel = new Fuel({
      connectors: [new FuelWalletConnector()],
    });
    const hasFuel = await fuel.hasABI('0x001123');
    expect(hasFuel).toBeTruthy();
  });
});
