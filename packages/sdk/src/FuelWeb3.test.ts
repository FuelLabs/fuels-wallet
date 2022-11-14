import {
  TransactionResponse,
  Address,
  bn,
  NativeAssetId,
  ScriptTransactionRequest,
  Wallet,
} from 'fuels';

import { MockConnection, toWallet, userWallet } from './__mock__/FuelWeb3';
import { seedWallet } from './__mock__/utils';

describe('FuelWeb3', () => {
  beforeAll(() => {
    MockConnection.start();
  });

  test('connect', async () => {
    const isConnected = await window.FuelWeb3.connect();
    expect(isConnected).toBeTruthy();
  });

  test('disconnect', async () => {
    const isConnected = await window.FuelWeb3.disconnect();
    expect(isConnected).toBeFalsy();
  });

  test('accounts', async () => {
    const accounts = await window.FuelWeb3.accounts();
    expect(accounts).toEqual([userWallet.address.toAddress()]);
  });

  test('signMessage', async () => {
    const accounts = await window.FuelWeb3.accounts();
    const account = accounts[0];
    // Test example like docs
    const signedMessage = await window.FuelWeb3.signMessage(account, 'test');
    const signedMesageSpec = await userWallet.signMessage('test');
    expect(signedMessage).toEqual(signedMesageSpec);
  });

  test('sendTransaction', async () => {
    const accounts = await window.FuelWeb3.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toAddress();
    // Seed wallet with funds
    await seedWallet(account, bn.parseUnits('1'));
    // Test example like docs
    const txRequest = new ScriptTransactionRequest({
      gasLimit: 50_000,
      gasPrice: 1,
    });
    const toAddress = Address.fromString(toAccount);
    const fromAddress = Address.fromString(account);
    const amount = bn.parseUnits('0.1');
    txRequest.addCoinOutput(toAddress, amount);
    const provider = window.FuelWeb3.getProvider();
    const resources = await provider.getResourcesToSpend(fromAddress, [
      [amount, NativeAssetId],
    ]);
    txRequest.addResources(resources);
    const transactionId = await window.FuelWeb3.sendTransaction(txRequest);
    const response = new TransactionResponse(transactionId, provider);
    // wait for transaction to be completed
    await response.wait();
    // query the balance of the destination wallet
    const balance = await window.FuelWeb3.getWallet(toAddress).getBalance(
      NativeAssetId
    );
    expect(balance.toNumber()).toBeGreaterThanOrEqual(amount.toNumber());
  });

  test('getWallet', async () => {
    const accounts = await window.FuelWeb3.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toString();
    // Test example like docs
    const wallet = window.FuelWeb3.getWallet(account);
    const toAddress = Address.fromString(toAccount);
    const amount = bn.parseUnits('0.1');
    const response = await wallet.transfer(toAddress, amount, NativeAssetId, {
      gasPrice: 1,
    });
    // wait for transaction to be completed
    await response.wait();
    // query the balance of the destination wallet
    const balance = await window.FuelWeb3.getWallet(toAddress).getBalance(
      NativeAssetId
    );
    expect(balance.toNumber()).toBeGreaterThanOrEqual(amount.toNumber());
  });

  test('getProvider', async () => {
    const provider = window.FuelWeb3.getProvider();
    const nodeInfo = await provider.getNodeInfo();
    expect(nodeInfo.nodeVersion).toBeTruthy();
  });

  test('User getProvider on fuels-ts Wallet', async () => {
    const accounts = await window.FuelWeb3.accounts();
    const account = accounts[0];
    const toAccount = toWallet.address.toString();
    // Test example like docs
    const walletLocked = Wallet.fromAddress(
      account,
      window.FuelWeb3.getProvider()
    );
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
