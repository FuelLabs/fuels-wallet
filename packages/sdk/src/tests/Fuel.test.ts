import {
  Address,
  bn,
  NativeAssetId,
  ScriptTransactionRequest,
  Wallet,
} from 'fuels';

import type { Fuel } from '../Fuel';

import type { MockServices } from './__mock__';
import {
  toWallet,
  mockFuel,
  seedWallet,
  AbiContractId,
  FlatAbi,
} from './__mock__';
import { FUEL_NETWORK } from './constants';

describe('Fuel', () => {
  let mocks: MockServices;
  let fuel: Fuel;

  beforeAll(() => {
    mocks = mockFuel();
    fuel = window.fuel!;
  });

  afterAll(() => {
    mocks.destroy();
  });

  test('hasWallet', async () => {
    const hasWallet = await fuel.hasWallet();
    expect(hasWallet).toBeTruthy();
  });

  test('isConnected', async () => {
    const isConnected = await fuel.isConnected();
    expect(isConnected).toBeTruthy();
  });

  test('connect', async () => {
    const isConnected = await fuel.connect();
    expect(isConnected).toBeTruthy();
  });

  test('disconnect', async () => {
    const isConnected = await fuel.disconnect();
    expect(isConnected).toBeTruthy();
  });

  test('accounts', async () => {
    const accounts = await fuel.accounts();
    expect(accounts).toEqual([
      mocks.backgroundService.state.wallet.address.toAddress(),
    ]);
  });

  test('currentAccount', async () => {
    const currentAccount = await fuel.currentAccount();
    expect(currentAccount).toEqual(
      mocks.backgroundService.state.wallet.address.toAddress()
    );
  });

  test('assets', async () => {
    const assets = await fuel.assets();
    expect(assets.length).toEqual(0);
  });

  test('addAsset', async () => {
    const asset = { assetId: NativeAssetId };
    const isAdded = await fuel.addAsset(asset);
    expect(isAdded).toEqual(true);
  });

  test('addAssets', async () => {
    const asset = { assetId: NativeAssetId };
    const isAdded = await fuel.addAssets([asset]);
    expect(isAdded).toEqual(true);
  });

  test('network', async () => {
    const network = await fuel.network();
    expect(network).toStrictEqual({ url: process.env.PUBLIC_PROVIDER_URL! });
  });

  test('networks', async () => {
    const networks = await fuel.networks();
    expect(networks).toStrictEqual([
      { url: process.env.PUBLIC_PROVIDER_URL! },
      FUEL_NETWORK,
    ]);
  });

  test('addNetwork', async () => {
    const isNetworkAdded = await fuel.addNetwork(FUEL_NETWORK);
    expect(isNetworkAdded).toEqual(true);
  });

  test('addAbi', async () => {
    const abiMap = {
      [AbiContractId]: FlatAbi,
    };
    const isAdded = await fuel.addAbi(abiMap);
    expect(isAdded).toEqual(true);
  });

  test('getAbi', async () => {
    const abiMap = {
      [AbiContractId]: FlatAbi,
    };
    await fuel.addAbi(abiMap);
    const abi = await fuel.getAbi(AbiContractId);

    expect(abi).toStrictEqual(FlatAbi);
  });

  test('hasAbi', async () => {
    const abiMap = {
      [AbiContractId]: FlatAbi,
    };
    await fuel.addAbi(abiMap);
    const hasAbi = await fuel.hasAbi(AbiContractId);

    expect(hasAbi).toBeTruthy();
  });

  test('signMessage', async () => {
    const accounts = await fuel.accounts();
    const account = accounts[0];

    // Test example like docs
    const signedMessage = await fuel.signMessage(account, 'test');
    const signedMessageSpec =
      await mocks.backgroundService.state.wallet.signMessage('test');
    expect(signedMessage).toEqual(signedMessageSpec);
  });

  test('sendTransaction', async () => {
    const accounts = await fuel.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toAddress();

    // Seed wallet with funds
    await seedWallet(account, bn.parseUnits('1'));

    // Test example like docs
    const transactionRequest = new ScriptTransactionRequest({
      gasLimit: 50_000,
      gasPrice: 1,
    });

    const toAddress = Address.fromString(toAccount);
    const amount = bn.parseUnits('0.1');
    transactionRequest.addCoinOutput(toAddress, amount);

    const wallet = await fuel.getWallet(account);
    const resources = await wallet.getResourcesToSpend([
      [amount, NativeAssetId],
    ]);

    transactionRequest.addResources(resources);
    const response = await wallet.sendTransaction(transactionRequest);

    // wait for transaction to be completed
    await response.wait();

    // query the balance of the destination wallet
    const addrWallet = await fuel.getWallet(toAddress);
    const balance = await addrWallet.getBalance(NativeAssetId);
    expect(balance.toNumber()).toBeGreaterThanOrEqual(amount.toNumber());
  });

  test('getWallet', async () => {
    const accounts = await fuel.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toString();

    // Test example like docs
    const wallet = await fuel.getWallet(account);
    const toAddress = Address.fromString(toAccount);
    const amount = bn.parseUnits('0.1');
    const response = await wallet.transfer(toAddress, amount, NativeAssetId, {
      gasPrice: 1,
    });

    // wait for transaction to be completed
    await response.wait();

    // query the balance of the destination wallet
    const addrWallet = await fuel.getWallet(toAddress);
    const balance = await addrWallet.getBalance(NativeAssetId);
    expect(balance.toNumber()).toBeGreaterThanOrEqual(amount.toNumber());
  });

  test('getProvider', async () => {
    const provider = await fuel.getProvider();
    const nodeInfo = await provider.getNodeInfo();
    expect(nodeInfo.nodeVersion).toBeTruthy();
  });

  test('User getProvider on fuels-ts Wallet', async () => {
    const accounts = await fuel.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toString();

    // Test example like docs
    const provider = await fuel.getProvider();
    const walletLocked = Wallet.fromAddress(account, provider);
    const toAddress = Address.fromString(toAccount);
    const response = await walletLocked.transfer(
      toAddress,
      bn.parseUnits('0.1'),
      NativeAssetId,
      { gasPrice: 1 }
    );

    // wait for transaction to be completed
    await response.wait();
  });
});

describe('Fuel Events', () => {
  let mocks: MockServices;
  let fuel: Fuel;

  beforeAll(() => {
    mocks = mockFuel();
    fuel = window.fuel!;
  });

  afterAll(() => {
    mocks.destroy();
  });

  test('Events: Connection events', async () => {
    const handleConnectionEvent = jest.fn();
    fuel.on(fuel.events.connection, handleConnectionEvent);
    await fuel.connect();
    expect(handleConnectionEvent).toBeCalledWith(true);
    await fuel.disconnect();
    expect(handleConnectionEvent).toBeCalledWith(false);
  });

  test('Events: Accounts events', async () => {
    const handleAccountsEvent = jest.fn();
    fuel.on(fuel.events.accounts, handleAccountsEvent);
    const accounts = await fuel.accounts();
    expect(handleAccountsEvent).toBeCalledWith(accounts);
  });

  test('Events: CurrentAccount events', async () => {
    const handleCurrentAccountEvent = jest.fn();
    fuel.on(fuel.events.currentAccount, handleCurrentAccountEvent);
    const currentAccount = await fuel.currentAccount();
    expect(handleCurrentAccountEvent).toBeCalledWith(currentAccount);
  });

  test('Events: Network events', async () => {
    const handleNetworkEvent = jest.fn();
    fuel.on(fuel.events.network, handleNetworkEvent);
    const network = await fuel.network();
    expect(handleNetworkEvent).toBeCalledWith(network);
  });
});
