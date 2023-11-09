import { EventEmitter } from 'events';
import {
  Address,
  BaseAssetId,
  Provider,
  TransactionStatus,
  Wallet,
  bn,
} from 'fuels';

import { Fuel } from '../Fuel';
import { FuelConnectorEventType } from '../api';
import { dispatchFuelConnectorEvent } from '../utils';

import { MockConnector } from './MockConnector';
import { promiseCallback } from './utils/promiseCallback';

describe('Fuel Wallet SDK multiple connectors', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('Add connector using event of a custom EventBus', async () => {
    const eventBus = new EventEmitter();
    const fuel = new Fuel({
      targetObject: eventBus,
      storage: null,
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
    const fuel = new Fuel({
      storage: null,
    });
    let connectors = await fuel.connectors();
    expect(connectors.length).toBe(0);

    // listen to connection event
    const onConnectors = promiseCallback();
    fuel.on(fuel.events.connectors, onConnectors);

    // Trigger event to add connector
    dispatchFuelConnectorEvent(new MockConnector());

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
      storage: null,
    });
    let hasConnector = await fuel.hasConnector();
    expect(hasConnector).toBeTruthy();

    fuel = new Fuel({
      connectors: [],
      storage: null,
    });
    hasConnector = await fuel.hasConnector();
    expect(hasConnector).toBeFalsy();
  });

  test('should throw if ping takes more than a second', async () => {
    const fuel = new Fuel({
      storage: null,
      connectors: [
        new MockConnector({
          pingDelay: 2000,
        }),
      ],
    });
    await expect(fuel.connect()).rejects.toThrowError();
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
      storage: null,
      connectors: [
        new MockConnector({
          wallets: wallets,
          networks: [network],
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
        gasLimit: bn(100_000),
      }
    );
    const { status } = await response.waitForResult();
    expect(status).toEqual(TransactionStatus.success);
    expect((await receiver.getBalance()).toString()).toEqual('1000');
  }, 10_000);

  test('should be able to have switch between connectors', async () => {
    const thirdPartyConnectorName = 'Third Party Wallet';
    const walletConnectorName = 'Fuel Wallet';
    const fuel = new Fuel({
      storage: null,
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
    });
    const thirdPartyConnector = new MockConnector({
      name: 'Third Party Wallet',
      networks: [
        {
          chainId: 1,
          url: 'https://thridy.fuel.network',
        },
      ],
    });
    const fuel = new Fuel({
      storage: null,
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
    });
    const thirdPartyConnector = new MockConnector({
      name: 'Third Party Wallet',
      networks: [
        {
          chainId: 1,
          url: 'https://thridy.fuel.network',
        },
      ],
    });
    const fuel = new Fuel({
      storage: null,
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
