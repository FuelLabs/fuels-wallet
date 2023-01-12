/* eslint-disable no-param-reassign */
import type { Account, Asset } from '@fuel-wallet/types';
import type {
  BN,
  TransactionRequest,
  TransactionRequestLike,
  WalletLocked,
  WalletUnlocked,
} from 'fuels';
import {
  Address,
  GAS_PER_BYTE,
  GAS_PRICE_FACTOR,
  bn,
  MAX_GAS_PER_TX,
  NativeAssetId,
  ScriptTransactionRequest,
  transactionRequestify,
  Wallet,
  Provider,
  TransactionResponse,
} from 'fuels';

import type { Transaction } from '../types';
import { getFee, getGasUsed, toJSON } from '../utils';

import { isEth } from '~/systems/Asset';
import { db, uniqueId } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

export type TxInputs = {
  get: {
    id: string;
  };
  add: Omit<Transaction, 'id'>;
  remove: {
    id: string;
  };
  request: {
    origin?: string;
    transactionRequest: TransactionRequest;
    providerUrl: string;
  };
  send: {
    transactionRequest: TransactionRequest;
    wallet: WalletUnlocked;
    providerUrl?: string;
  };
  simulateTransaction: {
    transactionRequest: TransactionRequest;
    providerUrl?: string;
  };
  getOutputs: {
    transactionRequest?: TransactionRequest;
    account?: Account | null;
  };
  createTransfer: {
    to: string;
    amount: BN;
    assetId: string;
  };
  fetch: {
    txId: string;
    providerUrl?: string;
  };
  getTxWithResources: {
    wallet: WalletLocked;
    tx: TransactionRequestLike;
    gasFee?: BN;
    needToAddResources?: boolean;
  };
  fundTransaction: {
    wallet: WalletLocked;
    tx: TransactionRequest;
  };
  isValidTransaction: {
    address?: string;
    account?: Account;
    asset?: Asset;
    amount?: BN;
    fee?: BN;
  };
};

export class TxService {
  static async clear() {
    return db.transaction('rw', db.transactions, async () => {
      return db.transactions.clear();
    });
  }

  static getAll() {
    return db.transaction('r', db.transactions, async () => {
      return db.transactions.toArray();
    });
  }

  static get(input: TxInputs['get']) {
    return db.transaction('r', db.transactions, async () => {
      return db.transactions.where(input).first();
    });
  }

  static add(input: TxInputs['add']) {
    const { type } = input;
    const data = toJSON(input.data!);
    return db.transaction('rw', db.transactions, async () => {
      const id = await db.transactions.add({ type, data, id: uniqueId() });
      return db.transactions.get(id);
    });
  }

  static remove(input: TxInputs['remove']) {
    return db.transaction('rw', db.transactions, async () => {
      const tx = await db.transactions.where(input).first();
      await db.transactions.where(input).delete();
      return tx;
    });
  }

  static async send({
    wallet,
    transactionRequest,
    providerUrl,
  }: TxInputs['send']) {
    wallet.provider = new Provider(providerUrl || '');
    return wallet.sendTransaction(transactionRequest);
  }

  static async fetch({ txId, providerUrl = '' }: TxInputs['fetch']) {
    const provider = new Provider(providerUrl);
    const txResponse = new TransactionResponse(txId, provider);

    return txResponse;
  }

  static async simulateTransaction({
    transactionRequest,
    providerUrl,
  }: TxInputs['simulateTransaction']) {
    const provider = new Provider(providerUrl || '');
    const { receipts } = await provider.call(transactionRequest);
    return receipts;
  }

  static async createFakeTx() {
    const network = await NetworkService.getSelectedNetwork();
    const toWallet = Wallet.generate();
    const params = { gasLimit: MAX_GAS_PER_TX };
    const request = new ScriptTransactionRequest(params);
    const dest = toWallet.address;
    const amount = bn(1);
    const receipts = await TxService.simulateTransaction({
      transactionRequest: request,
      providerUrl: network?.url,
    });

    request.addCoinOutput(dest, amount, NativeAssetId);
    const gasFee = getFee({
      receipts,
      transaction: request.toTransaction(),
      gasPerByte: GAS_PER_BYTE,
      gasPriceFactor: GAS_PRICE_FACTOR,
    });
    return {
      request,
      gasFee,
    };
  }

  static async createTransfer(input: TxInputs['createTransfer']) {
    const request = new ScriptTransactionRequest({ gasLimit: MAX_GAS_PER_TX });
    const to = Address.fromAddressOrString(input.to);
    const { assetId, amount } = input;
    request.addCoinOutput(to, amount, assetId);
    return request;
  }

  static async getTxWithResources(input: TxInputs['getTxWithResources']) {
    const { needToAddResources = true, gasFee = bn(0) } = input || {};
    const request = transactionRequestify(input.tx);
    const coins = request.getCoinOutputs();
    const requiredCoins = coins.map((coin) => ({
      assetId: coin.assetId,
      amount: isEth(coin) ? bn(coin.amount).add(gasFee) : bn(coin.amount),
    }));

    if (needToAddResources) {
      const addr = input.wallet.address;
      const provider = input.wallet.provider;
      const resources = await provider.getResourcesToSpend(addr, requiredCoins);
      request.addResources(resources);
    }
    return request;
  }

  static async fundTransaction(input: TxInputs['fundTransaction']) {
    const { wallet, tx } = input;
    const preRequest = await TxService.getTxWithResources({ wallet, tx });
    const request = transactionRequestify(tx);
    const gasPrice = preRequest.gasPrice;
    const transaction = preRequest.toTransaction();
    const receipts = await TxService.simulateTransaction({
      transactionRequest: request,
      providerUrl: wallet.provider.url,
    });

    const getOpts = {
      receipts,
      gasPerByte: GAS_PER_BYTE,
      gasPriceFactor: GAS_PRICE_FACTOR,
    };
    const fee = getFee({ transaction, ...getOpts });
    const gasUsed = getGasUsed({ transaction, ...getOpts });

    request.gasLimit = gasUsed;
    request.gasPrice = gasPrice;
    const finalRequest = await TxService.getTxWithResources({
      wallet,
      tx: request,
      gasFee: fee,
      needToAddResources: false,
    });
    return {
      request: finalRequest,
    };
  }

  static isValidTransaction(input: TxInputs['isValidTransaction']) {
    const { account, asset, fee, amount, address } = input;
    if (!account || !asset || !fee || !amount || !address) return false;
    const assetBalance = getAssetAccountBalance(account, asset?.assetId);
    if (isEth(asset.assetId)) return assetBalance.gte(bn(amount).add(fee));
    const ethBalance = getAssetAccountBalance(account, NativeAssetId);
    const hasAssetBalance = assetBalance.gte(bn(amount));
    const hasGasFeeBalance = ethBalance.gte(bn(fee));
    return hasAssetBalance && hasGasFeeBalance;
  }
}

export function getAssetAccountBalance(account: Account, assetId: string) {
  const balances = account.balances || [];
  const asset = balances.find((balance) => balance.assetId === assetId);
  return bn(asset?.amount);
}
