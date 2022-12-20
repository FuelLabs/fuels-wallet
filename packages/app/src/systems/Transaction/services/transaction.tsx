/* eslint-disable no-param-reassign */
import type { Account, Asset } from '@fuel-wallet/types';
import {
  Address,
  hexlify,
  MAX_GAS_PER_TX,
  ScriptTransactionRequest,
  Provider,
  TransactionResponse,
  bn,
  calculateTransactionFee,
  Wallet,
  transactionRequestify,
  NativeAssetId,
} from 'fuels';
import type {
  BN,
  TransactionRequest,
  WalletUnlocked,
  TransactionRequestLike,
  WalletLocked,
} from 'fuels';

import type { Transaction } from '../types';
import { getCoinOutputsFromTx, parseTransaction } from '../utils';

import { getBalance } from '~/systems/Account/utils';
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
    tx: TransactionRequest;
    origin: string;
    providerUrl: string;
  };
  send: {
    tx: TransactionRequest;
    wallet: WalletUnlocked;
    providerUrl?: string;
  };
  calculateFee: {
    tx: TransactionRequest;
    providerUrl?: string;
  };
  fetchGasPrice: {
    providerUrl?: string;
  };
  getOutputs: {
    tx?: TransactionRequest;
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
};

type GetTxWithResourcesOpts = {
  wallet: WalletLocked;
  tx: TransactionRequestLike;
  gasFee?: BN;
  needToAddResources?: boolean;
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
    const data = parseTransaction(input.data!);
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

  static async send({ wallet, tx, providerUrl }: TxInputs['send']) {
    wallet.provider = new Provider(providerUrl || '');
    return wallet.sendTransaction(tx);
  }

  static async fetch({ txId, providerUrl = '' }: TxInputs['fetch']) {
    const provider = new Provider(providerUrl);
    const txResponse = new TransactionResponse(txId, provider);

    return txResponse;
  }

  static async calculateFee({ tx, providerUrl }: TxInputs['calculateFee']) {
    const { gasPrice } = tx;
    const provider = new Provider(providerUrl || '');
    const { receipts } = await provider.call(tx, { utxoValidation: false });
    const result = calculateTransactionFee({ receipts, gasPrice });
    return result.fee;
  }

  static async fetchGasPrice({ providerUrl }: TxInputs['fetchGasPrice']) {
    const provider = new Provider(providerUrl || '');
    const { minGasPrice } = await provider.getNodeInfo();
    return minGasPrice;
  }

  static getOutputs({ tx, account }: TxInputs['getOutputs']) {
    const coinOutputs = getCoinOutputsFromTx(tx);
    const outputsToSend = coinOutputs.filter(
      (value) => value.to !== account?.publicKey
    );
    const outputAmount = outputsToSend.reduce(
      (acc, value) => acc.add(value.amount),
      bn(0)
    );

    return { coinOutputs, outputsToSend, outputAmount };
  }

  static async createTransfer(input: TxInputs['createTransfer']) {
    const request = new ScriptTransactionRequest({ gasPrice: 0 });
    const to = Address.fromAddressOrString(input.to);
    const { assetId, amount } = input;
    request.addCoinOutput(to, amount, assetId);
    return request;
  }

  static async getTxWithResources(opts: GetTxWithResourcesOpts) {
    const { needToAddResources = true, gasFee = bn(0) } = opts || {};
    const request = transactionRequestify(opts.tx);
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
        opts.wallet.address,
        requiredCoins
      );
      request.addResources(resources);
    }
    return request;
  }

  static async fundTransaction(
    wallet: WalletLocked,
    tx: TransactionRequestLike
  ) {
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

  static checkIsValid(account: Account, asset?: Asset, amount?: BN, fee?: BN) {
    if (!account || !asset || !fee || !amount) return true;
    const assetBalance = getBalance(account, asset?.assetId);
    if (isEth(asset)) assetBalance.gte(bn(amount).add(fee));
    const ethBalance = getBalance(account, NativeAssetId);
    const hasAssetBalance = assetBalance.gte(bn(amount));
    const hasGasFeeBalance = ethBalance.gte(bn(fee));
    return hasAssetBalance && hasGasFeeBalance;
  }
}
