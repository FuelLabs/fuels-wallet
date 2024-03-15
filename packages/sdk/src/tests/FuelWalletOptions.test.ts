import type {
  AbstractAddress,
  BN,
  BytesLike,
  ProviderOptions,
  StorageAbstract,
} from 'fuels';
import { BaseAssetId, Fuel, Provider, Wallet, bn } from 'fuels';

import { MockConnector } from './MockConnector';

describe('Fuel Wallet SDK test different options', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('Using custom storage', async () => {
    const storage: StorageAbstract = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    const connector = new MockConnector();
    const fuel = new Fuel({
      connectors: [connector],
      storage: storage,
    });

    await fuel.hasConnector();
    expect(storage.getItem).toBeCalledTimes(1);
    expect(storage.getItem).toBeCalledWith(Fuel.STORAGE_KEY);
    expect(storage.setItem).toBeCalledTimes(1);
    expect(storage.setItem).toBeCalledWith(Fuel.STORAGE_KEY, connector.name);
    await fuel.clean();
    expect(storage.removeItem).toBeCalledTimes(1);
    expect(storage.removeItem).toBeCalledWith(Fuel.STORAGE_KEY);
    await fuel.destroy();
    expect(storage.removeItem).toBeCalledTimes(2);
    expect(storage.removeItem).toBeCalledWith(Fuel.STORAGE_KEY);
  });

  test('Should store on localStorage and remove on clean', async () => {
    const connector = new MockConnector();
    const fuel = new Fuel({
      connectors: [connector],
    });

    await fuel.hasConnector();
    const value = window.localStorage.getItem(Fuel.STORAGE_KEY);
    expect(value).toBeTruthy();
    expect(value).toEqual(connector.name);
    fuel.clean();
    const value2 = window.localStorage.getItem(Fuel.STORAGE_KEY);
    expect(value2).toBeFalsy();
  });

  test('Should remove all listeners', async () => {
    const connector = new MockConnector();
    const fuel = new Fuel({
      connectors: [connector],
    });

    await fuel.hasConnector();
    const onConnection = jest.fn();
    fuel.on(fuel.events.connection, onConnection);

    // Expect to be call
    fuel.emit(fuel.events.connection, true);
    connector.emit(fuel.events.connection, true);
    expect(onConnection).toBeCalledTimes(2);
    onConnection.mockClear();
    // Expect to not be called after cleaning
    fuel.unsubscribe();
    fuel.emit(fuel.events.connection, true);
    connector.emit(fuel.events.connection, true);
    expect(onConnection).toBeCalledTimes(0);
  });

  test('Should remove all listeners and clean storage on destroy', async () => {
    const connector = new MockConnector();
    const fuel = new Fuel({
      connectors: [connector],
    });

    await fuel.hasConnector();
    const onConnection = jest.fn();
    fuel.on(fuel.events.connection, onConnection);
    expect(window.localStorage.getItem(Fuel.STORAGE_KEY)).toBeTruthy();

    // Expect to not be called after cleaning
    fuel.destroy();
    fuel.emit(fuel.events.connection, true);
    connector.emit(fuel.events.connection, true);
    expect(onConnection).toBeCalledTimes(0);
    expect(window.localStorage.getItem(Fuel.STORAGE_KEY)).toBeFalsy();
  });

  test('Should be able to getWallet with custom provider', async () => {
    const defaultProvider = await Provider.create(
      'http://localhost:4001/graphql'
    );
    const defaultWallet = Wallet.generate({
      provider: defaultProvider,
    });
    const connector = new MockConnector({
      wallets: [defaultWallet],
    });
    const fuel = new Fuel({
      connectors: [connector],
    });
    class CustomProvider extends Provider {
      static async create(url: string, opts?: ProviderOptions) {
        const provider = new CustomProvider(url, opts);
        await provider.fetchChainAndNodeInfo();
        return provider;
      }

      async getBalance(
        _owner: AbstractAddress,
        _assetId: BytesLike = BaseAssetId
      ): Promise<BN> {
        return bn(1234);
      }
    }

    const currentAccount = await fuel.currentAccount();
    const provider = await CustomProvider.create(
      'http://localhost:4001/graphql'
    );
    const wallet = await fuel.getWallet(currentAccount!, provider);
    expect(wallet.provider).toBeInstanceOf(CustomProvider);
    expect(await wallet.getBalance()).toEqual(bn(1234));
  });
});
