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
  bn,
  hexlify,
  MAX_GAS_PER_TX,
  NativeAssetId,
  ScriptTransactionRequest,
  transactionRequestify,
  Wallet,
  Provider,
  TransactionResponse,
} from 'fuels';

import type { Transaction } from '../types';
import { toJSON } from '../utils';

import { ASSET_MAP, isEth } from '~/systems/Asset';
import { db, uniqueId } from '~/systems/Core';
import { provider } from '~/systems/DApp/__mocks__/dapp-provider';

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

  static async createTransfer(input: TxInputs['createTransfer']) {
    const request = new ScriptTransactionRequest({ gasPrice: 0 });
    const to = Address.fromAddressOrString(input.to);
    const { assetId, amount } = input;
    request.addCoinOutput(to, amount, assetId);
    return request;
  }

  static async getTxWithResources(input: TxInputs['getTxWithResources']) {
    const { needToAddResources = true, gasFee = bn(0) } = input || {};
    const request = transactionRequestify(input.tx);
    const coins = request.getCoinOutputs();
    const requiredCoins = coins.map((coin) => {
      let amount = bn(coin.amount);
      if (coin.assetId === NativeAssetId) {
        amount = amount.add(gasFee || bn(0));
      }
      return { assetId: coin.assetId, amount };
    });

    if (needToAddResources) {
      const resources = await provider.getResourcesToSpend(
        input.wallet.address,
        requiredCoins
      );
      request.addResources(resources);
    }
    return request;
  }

  static async fundTransaction(input: TxInputs['fundTransaction']) {
    const { wallet, tx } = input;
    const preRequest = await TxService.getTxWithResources({ wallet, tx });
    const txCost = await wallet.provider.getTransactionCost(preRequest);
    const request = transactionRequestify(tx);
    request.gasLimit = txCost.gasUsed;
    request.gasPrice = txCost.gasPrice;
    const finalRequest = await TxService.getTxWithResources({
      wallet,
      tx: request,
      gasFee: txCost.fee,
      needToAddResources: false,
    });
    return {
      request: finalRequest,
      txCost,
    };
  }

  static async createFakeTx() {
    const toWallet = Wallet.generate();
    const params = { gasLimit: MAX_GAS_PER_TX };
    const request = new ScriptTransactionRequest(params);
    const dest = toWallet.address;
    const assetId = Object.values(ASSET_MAP)[0].assetId;
    const amount = bn(1);

    request.addCoinOutput(dest, amount, assetId);
    const fee = request.calculateFee();
    if (fee && fee.assetId === hexlify(assetId)) {
      fee.amount.add(amount);
    }
    return fee.amount;
  }

  static isValidTransaction(input: TxInputs['isValidTransaction']) {
    const { account, asset, fee, amount, address } = input;
    if (!account || !asset || !fee || !amount || !address) return false;
    const assetBalance = getAssetAccountBalance(account, asset?.assetId);
    if (isEth(asset)) return assetBalance.gte(bn(amount).add(fee));
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
