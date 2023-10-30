import {
  Address,
  BaseAssetId,
  Provider,
  TransactionStatus,
  Wallet,
  bn,
} from 'fuels';
import { EventEmitter } from 'stream';

import { Fuel } from '../Fuel';
import { FuelConnectorEventType } from '../api';
import { FuelConnectorEvent } from '../types';

import { MockConnector } from './MockConnector';
import { generateAccounts } from './utils/generateAccounts';
import { promiseCallback } from './utils/promiseCallback';

describe('Fuel', () => {
  beforeAll(() => {
    // Remove storage to avoid conflicts between tests
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(Fuel.prototype, 'getStorage').mockImplementation(() => null);
  });

  test('Add connector using event of a custom EventBus', async () => {
    const eventBus = new EventEmitter();
    const fuel = new Fuel({
      targetObject: eventBus,
    });
    let connectors = await fuel.connectors();
    expect(connectors.length).toBe(0);

    // listen to connection event
    const onConnectors = promiseCallback();
    fuel.on(fuel.events.connectors, onConnectors);

    // Trigger event to add connector
    eventBus.emit(FuelConnectorEventType, new MockConnector());
    // wait for the event to be triggered
    await onConnectors.promise;

    connectors = await fuel.connectors();
    expect(onConnectors).toBeCalledTimes(1);
    expect(onConnectors).toBeCalledWith(connectors);
    expect(connectors.length).toBeGreaterThan(0);
    expect(connectors[0].name).toEqual('Fuel Wallet');
    expect(connectors[0].installed).toEqual(true);
  });

  test('Add connector using window events', async () => {
    const fuel = new Fuel();
    let connectors = await fuel.connectors();
    expect(connectors.length).toBe(0);

    // listen to connection event
    const onConnectors = promiseCallback();
    fuel.on(fuel.events.connectors, onConnectors);

    // Trigger event to add connector
    const event = new FuelConnectorEvent(new MockConnector());
    window.dispatchEvent(event);

    // wait for the event to be triggered
    await onConnectors.promise;

    connectors = await fuel.connectors();
    expect(onConnectors).toBeCalledTimes(1);
    expect(onConnectors).toBeCalledWith(connectors);
    expect(connectors.length).toBeGreaterThan(0);
    expect(connectors[0].name).toEqual('Fuel Wallet');
    expect(connectors[0].installed).toEqual(true);
  });

  test('hasConnector', async () => {
    let fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    let hasConnector = await fuel.hasConnector();
    expect(hasConnector).toBeTruthy();

    fuel = new Fuel({
      connectors: [],
    });
    hasConnector = await fuel.hasConnector();
    expect(hasConnector).toBeFalsy();
  });

  test('isConnected', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const isConnected = await fuel.isConnected();
    expect(isConnected).toBeTruthy();
  });

  test('connect', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });

    // listen to connection event
    const onConnection = promiseCallback();
    const onAccounts = promiseCallback();
    const onCurrentAccount = promiseCallback();
    fuel.on(fuel.events.connection, onConnection);
    fuel.on(fuel.events.accounts, onAccounts);
    fuel.on(fuel.events.currentAccount, onCurrentAccount);

    const isConnected = await fuel.connect();
    expect(isConnected).toBeTruthy();
    const accounts = await fuel.accounts();
    await onConnection.promise;
    await onAccounts.promise;
    await onCurrentAccount.promise;

    expect(onConnection).toBeCalledTimes(1);
    expect(onConnection).toBeCalledWith(true);
    expect(onAccounts).toBeCalledTimes(1);
    expect(onAccounts).toBeCalledWith(accounts);
    expect(onCurrentAccount).toBeCalledTimes(1);
    expect(onCurrentAccount).toBeCalledWith(accounts[0]);
  });

  test('disconnect', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });

    // listen to connection event
    const onConnection = jest.fn();
    const onAccounts = jest.fn();
    const onCurrentAccount = jest.fn();
    fuel.on(fuel.events.connection, onConnection);
    fuel.on(fuel.events.accounts, onAccounts);
    fuel.on(fuel.events.currentAccount, onCurrentAccount);

    const isConnected = await fuel.disconnect();
    expect(isConnected).toBeFalsy();
    expect(onConnection).toBeCalledTimes(1);
    expect(onConnection).toBeCalledWith(false);
    expect(onAccounts).toBeCalledWith([]);
    expect(onCurrentAccount).toBeCalledWith(null);
  });

  test('accounts', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const accounts = await fuel.accounts();
    expect(accounts.length).toBeGreaterThan(0);
  });

  test('currentAccount', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const [account] = await fuel.accounts();
    const currentAccount = await fuel.currentAccount();
    expect(currentAccount).toEqual(account);
  });

  test('networks', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const networks = await fuel.networks();
    expect(networks.length).toBeGreaterThan(0);
  });

  test('currentNetwork', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const [network] = await fuel.networks();
    const currentNetwork = await fuel.currentNetwork();
    expect(currentNetwork).toEqual(network);
  });

  test('addNetwork', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const newNetwork = {
      url: 'https://beta-4.fuel.network',
      chainId: 1,
    };

    // listen to connection event
    const onNetworks = jest.fn();
    const onCurrentNetwork = jest.fn();
    fuel.on(fuel.events.networks, onNetworks);
    fuel.on(fuel.events.currentNetwork, onCurrentNetwork);

    const isNetworkAdded = await fuel.addNetwork(newNetwork);
    const networks = await fuel.networks();
    expect(isNetworkAdded).toEqual(true);
    expect(networks).toContain(newNetwork);
    expect(onNetworks).toBeCalledTimes(1);
    expect(onNetworks).toBeCalledWith(networks);
    expect(onCurrentNetwork).toBeCalledTimes(1);
    expect(onCurrentNetwork).toBeCalledWith(newNetwork);
  });

  test('selectNetwork', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const newNetwork = {
      url: 'https://beta-4.fuel.network',
      chainId: 0,
    };

    // listen to connection event
    const onCurrentNetwork = jest.fn();
    fuel.on(fuel.events.currentNetwork, onCurrentNetwork);

    const networkHasSwitch = await fuel.selectNetwork(newNetwork);
    expect(networkHasSwitch).toEqual(true);
    expect(onCurrentNetwork).toBeCalledTimes(1);
    expect(onCurrentNetwork).toBeCalledWith(newNetwork);
  });

  test('addAsset', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
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
      connectors: [new MockConnector()],
    });
    const assets = await fuel.assets();
    expect(assets.length).toEqual(0);
  });

  test('addABI', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
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
      connectors: [new MockConnector()],
    });
    const abi = await fuel.getABI('0x001123');
    expect(abi).toStrictEqual(null);
  });

  test('hasABI', async () => {
    const fuel = new Fuel({
      connectors: [new MockConnector()],
    });
    const hasFuel = await fuel.hasABI('0x001123');
    expect(hasFuel).toBeTruthy();
  });
  test('getWallet and transfer amount', async () => {
    const provider = await Provider.create('http://localhost:4001/graphql');
    const wallets = [
      Wallet.fromPrivateKey(
        '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
        provider
      ),
    ];
    const network = {
      chainId: await provider.getChainId(),
      url: provider.url,
    };
    const fuel = new Fuel({
      connectors: [
        new MockConnector({
          wallets: wallets,
          networks: [network],
          accounts: wallets.map((w) => w.address.toString()),
        }),
      ],
    });
    const account = await fuel.currentAccount();
    expect(account).toBeTruthy();
    const wallet = await fuel.getWallet(account!);
    expect(wallet.provider.url).toEqual(network.url);
    const receiver = Wallet.fromAddress(Address.fromRandom(), provider);
    const response = await wallet.transfer(
      receiver.address,
      bn(1000),
      BaseAssetId,
      {
        gasPrice: bn(1),
        gasLimit: bn(1_000_000),
      }
    );
    const { status } = await response.waitForResult();
    expect(status).toEqual(TransactionStatus.success);
    expect((await receiver.getBalance()).toString()).toEqual('1000');
  }, 10_000);

  test('should throw if ping takes more than a second', async () => {
    const fuel = new Fuel({
      connectors: [
        new MockConnector({
          pingDelay: 2000,
        }),
      ],
    });
    await expect(fuel.connect()).rejects.toThrowError();
  });
});

describe('Fuel Multiple Connectors', () => {
  beforeAll(() => {
    // Remove storage to avoid conflicts between tests
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(Fuel.prototype, 'getStorage').mockImplementation(() => null);
  });

  test('should be able to have switch between connectors', async () => {
    const thirdPartyConnectorName = 'Third Party Wallet';
    const walletConnectorName = 'Fuel Wallet';
    const fuel = new Fuel({
      connectors: [
        new MockConnector({
          name: walletConnectorName,
        }),
        new MockConnector({
          accounts: [],
          name: thirdPartyConnectorName,
        }),
      ],
    });

    // Connectors should be available
    const connectors = await fuel.connectors();
    expect(connectors.length).toEqual(2);
    expect(connectors[0].name).toEqual(walletConnectorName);
    expect(connectors[1].name).toEqual(thirdPartyConnectorName);
    // Switch between connectors
    expect(fuel.currentConnector()?.name).toBe(walletConnectorName);
    expect(await fuel.accounts()).toHaveLength(2);
    await fuel.selectConnector(thirdPartyConnectorName);
    expect(fuel.currentConnector()?.name).toBe(thirdPartyConnectorName);
    expect(await fuel.accounts()).toHaveLength(0);
  });

  test('should trigger currentConnector and other events when switch connector', async () => {
    const walletConnector = new MockConnector({
      name: 'Fuel Wallet',
      networks: [
        {
          chainId: 0,
          url: 'https://wallet.fuel.network',
        },
      ],
      accounts: generateAccounts(2),
    });
    const thirdPartyConnector = new MockConnector({
      name: 'Third Party Wallet',
      networks: [
        {
          chainId: 0,
          url: 'https://thridy.fuel.network',
        },
      ],
      accounts: generateAccounts(2),
    });
    const fuel = new Fuel({
      connectors: [walletConnector, thirdPartyConnector],
    });

    async function expectEventsForConnector(connector: MockConnector) {
      const onCurrentConnector = promiseCallback();
      const onConnection = promiseCallback();
      const onAccounts = promiseCallback();
      const onNetworks = promiseCallback();
      const onCurrentNetwork = promiseCallback();
      const onCurrentAccount = promiseCallback();
      fuel.on(fuel.events.currentConnector, onCurrentConnector);
      fuel.on(fuel.events.connection, onConnection);
      fuel.on(fuel.events.accounts, onAccounts);
      fuel.on(fuel.events.networks, onNetworks);
      fuel.on(fuel.events.currentNetwork, onCurrentNetwork);
      fuel.on(fuel.events.currentAccount, onCurrentAccount);

      await fuel.selectConnector(connector.name);
      await Promise.all([
        onCurrentConnector.promise,
        onConnection.promise,
        onAccounts.promise,
        onNetworks.promise,
        onCurrentNetwork.promise,
        onCurrentAccount.promise,
      ]);

      expect(onCurrentConnector).toBeCalledTimes(1);
      expect(onCurrentConnector).toBeCalledWith(
        fuel.getConnector(connector.name)
      );
      expect(onConnection).toBeCalledTimes(1);
      expect(onConnection).toBeCalledWith(true);
      expect(onAccounts).toBeCalledTimes(1);
      expect(onAccounts).toBeCalledWith(connector._accounts);
      expect(onNetworks).toBeCalledTimes(1);
      expect(onNetworks).toBeCalledWith(connector._networks);
      expect(onCurrentNetwork).toBeCalledTimes(1);
      expect(onCurrentNetwork).toBeCalledWith(connector._networks[0]);
      expect(onCurrentAccount).toBeCalledTimes(1);
      expect(onCurrentAccount).toBeCalledWith(connector._accounts[0]);
    }

    await fuel.hasConnector();
    await expectEventsForConnector(thirdPartyConnector);
    await expectEventsForConnector(walletConnector);
  });

  test('should only proxy events from the currentConnector', async () => {
    const walletConnector = new MockConnector({
      name: 'Fuel Wallet',
      networks: [
        {
          chainId: 0,
          url: 'https://wallet.fuel.network',
        },
      ],
      accounts: generateAccounts(2),
    });
    const thirdPartyConnector = new MockConnector({
      name: 'Third Party Wallet',
      networks: [
        {
          chainId: 0,
          url: 'https://thridy.fuel.network',
        },
      ],
      accounts: generateAccounts(2),
    });
    const fuel = new Fuel({
      connectors: [walletConnector, thirdPartyConnector],
    });

    // Select wallet connector
    await fuel.selectConnector(walletConnector.name);
    // Select third party connector
    await fuel.selectConnector(thirdPartyConnector.name);
    // Select wallet connector
    await fuel.selectConnector(walletConnector.name);

    // Ensure that the current connector is the wallet connector
    expect(fuel.currentConnector()?.name).toBe(walletConnector.name);

    const onAccounts = promiseCallback();
    fuel.on(fuel.events.accounts, onAccounts);

    // Should not call event with third party connector
    thirdPartyConnector.emit(
      fuel.events.accounts,
      thirdPartyConnector._accounts
    );
    expect(onAccounts).toBeCalledTimes(0);

    // Should trigger event from the current connector
    walletConnector.emit(fuel.events.accounts, walletConnector._accounts);
    expect(onAccounts).toBeCalledTimes(1);
    expect(onAccounts).toBeCalledWith(walletConnector._accounts);
  });

  test('Retrieve default connector from storage', async () => {
    const walletConnector = new MockConnector({
      name: 'Fuel Wallet',
    });
    const thirdPartyConnector = new MockConnector({
      name: 'Third Party Wallet',
    });
    const fuel = new Fuel({
      connectors: [walletConnector, thirdPartyConnector],
      storage: window.localStorage,
    });

    // Select third party connector
    await fuel.selectConnector(thirdPartyConnector.name);

    const fuelNewInstance = new Fuel({
      connectors: [walletConnector, thirdPartyConnector],
      storage: window.localStorage,
    });
    await fuelNewInstance.hasConnector();
    expect(fuelNewInstance.currentConnector()?.name).toBe(
      thirdPartyConnector.name
    );
  });
});
