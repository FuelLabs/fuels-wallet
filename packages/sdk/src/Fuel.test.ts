import {
  TransactionResponse,
  Address,
  bn,
  NativeAssetId,
  ScriptTransactionRequest,
  Wallet,
} from 'fuels';

import { fuel, MockConnection, toWallet, userWallet } from './__mock__/Fuel';
import { seedWallet } from './__mock__/utils';

describe('Fuel', () => {
  beforeAll(() => {
    MockConnection.start();
  });

  test('connect', async () => {
    const isConnected = await fuel.connect();
    expect(isConnected).toBeTruthy();
  });

  test('disconnect', async () => {
    const isConnected = await fuel.disconnect();
    expect(isConnected).toBeFalsy();
  });

  test('accounts', async () => {
    const accounts = await fuel.accounts();
    expect(accounts).toEqual([userWallet.address.toAddress()]);
  });

  test('signMessage', async () => {
    const accounts = await fuel.accounts();
    const account = accounts[0];

    // Test example like docs
    const signedMessage = await fuel.signMessage(account, 'test');
    const signedMesageSpec = await userWallet.signMessage('test');
    expect(signedMessage).toEqual(signedMesageSpec);
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
    const fromAddress = Address.fromString(account);
    const amount = bn.parseUnits('0.1');
    transactionRequest.addCoinOutput(toAddress, amount);

    const provider = fuel.getProvider();
    const resources = await provider.getResourcesToSpend(fromAddress, [
      [amount, NativeAssetId],
    ]);

    transactionRequest.addResources(resources);
    const transactionId = await fuel.sendTransaction(transactionRequest);
    const response = new TransactionResponse(transactionId, provider);

    // wait for transaction to be completed
    await response.wait();

    // query the balance of the destination wallet
    const addrWallet = fuel.getWallet(toAddress);
    const balance = await addrWallet.getBalance(NativeAssetId);
    expect(balance.toNumber()).toBeGreaterThanOrEqual(amount.toNumber());
  });

  test('getWallet', async () => {
    const accounts = await fuel.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toString();

    // Test example like docs
    const wallet = fuel.getWallet(account);
    const toAddress = Address.fromString(toAccount);
    const amount = bn.parseUnits('0.1');
    const response = await wallet.transfer(toAddress, amount, NativeAssetId, {
      gasPrice: 1,
    });

    // wait for transaction to be completed
    await response.wait();

    // query the balance of the destination wallet
    const addrWallet = fuel.getWallet(toAddress);
    const balance = await addrWallet.getBalance(NativeAssetId);
    expect(balance.toNumber()).toBeGreaterThanOrEqual(amount.toNumber());
  });

  test('getProvider', async () => {
    const provider = fuel.getProvider();
    const nodeInfo = await provider.getNodeInfo();
    expect(nodeInfo.nodeVersion).toBeTruthy();
  });

  test('User getProvider on fuels-ts Wallet', async () => {
    const accounts = await fuel.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toString();

    // Test example like docs
    const provider = fuel.getProvider();
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
