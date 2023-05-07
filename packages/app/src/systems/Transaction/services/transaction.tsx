import type { Account, Asset } from '@fuel-wallet/types';
import type {
  BN,
  TransactionRequest,
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
  Provider,
  TransactionResponse,
} from 'fuels';

import type { Transaction } from '../types';
import { getFee, getGasUsed, toJSON, processTransactionToTx } from '../utils';

import { AccountService } from '~/systems/Account';
import { isEth } from '~/systems/Asset';
import { db, uniqueId, WalletLockedCustom } from '~/systems/Core';
import { getGraphqlClient } from '~/systems/Core/utils/graphql';
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
    address?: string;
    origin?: string;
    title?: string;
    favIconUrl?: string;
    transactionRequest: TransactionRequest;
    providerUrl: string;
  };
  send: {
    address: string;
    transactionRequest: TransactionRequest;
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
  getTransactionHistory: {
    address: string;
  };
  addResources: {
    wallet: WalletLocked;
    gasFee?: BN;
    transactionRequest: TransactionRequest;
    needToAddResources?: boolean;
  };
  fundTransaction: {
    wallet: WalletLocked;
    transactionRequest: TransactionRequest;
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
    address,
    transactionRequest,
    providerUrl = '',
  }: TxInputs['send']) {
    const wallet = new WalletLockedCustom(address, providerUrl);
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

  static async getTransactionHistory({
    address,
  }: TxInputs['getTransactionHistory']) {
    const network = await NetworkService.getSelectedNetwork();
    if (!network) {
      throw new Error('No network selected');
    }
    const { transactionsByOwner, chain } = await getGraphqlClient(
      network.url
    ).AddressTransactions({
      owner: address,
      // TODO: remove hardcode size when we add
      // pagination for transactions page
      first: 100,
    });
    const gasPerByte = chain.consensusParameters.gasPerByte;
    const gasPriceFactor = chain.consensusParameters.gasPriceFactor;
    const transactions = processTransactionToTx(
      transactionsByOwner,
      bn(gasPerByte),
      bn(gasPriceFactor)
    );
    // TODO: remove this when fuel-client returns
    // the txs sort by date
    transactions?.sort((a, b) => {
      const aTime = bn(a.time, 10);
      const bTime = bn(b.time, 10);
      return aTime.gt(bTime) ? -1 : 1;
    });
    return transactions || [];
  }

  static async createFakeTx() {
    const [account, network] = await Promise.all([
      AccountService.getCurrentAccount(),
      NetworkService.getSelectedNetwork(),
    ]);
    const wallet = new WalletLockedCustom(account!.address, network!.url);
    const params = { gasLimit: MAX_GAS_PER_TX };
    const request = new ScriptTransactionRequest(params);
    request.addCoinOutput(wallet.address, bn(1), NativeAssetId);
    await wallet.fund(request);
    const txCost = await getTxCost(request, wallet);

    return {
      request,
      ...txCost,
    };
  }

  static async createTransfer(input: TxInputs['createTransfer']) {
    const request = new ScriptTransactionRequest({ gasLimit: MAX_GAS_PER_TX });
    const to = Address.fromAddressOrString(input.to);
    const { assetId, amount } = input;
    request.addCoinOutput(to, amount, assetId);
    return transactionRequestify(request);
  }

  static async addResources(input: TxInputs['addResources']) {
    const { gasFee = bn(0), wallet } = input || {};
    const request = input.transactionRequest;
    const coins = request.getCoinOutputs().map((coin) => ({
      assetId: coin.assetId,
      amount: isEth(coin) ? bn(coin.amount).add(gasFee) : bn(coin.amount),
    }));

    if (!coins.find(isEth)) {
      coins.push({
        assetId: NativeAssetId,
        amount: gasFee,
      });
    }

    const resources = await wallet.getResourcesToSpend(coins);
    request.addResources(resources);
    return request;
  }

  static async fundTransaction(input: TxInputs['fundTransaction']) {
    const { minGasPrice } = await input.wallet.provider.getNodeInfo();
    const transactionRequest = await TxService.addResources({
      ...input,
      gasFee: minGasPrice,
    });
    const txCost = await getTxCost(transactionRequest, input.wallet);
    transactionRequest.gasLimit = txCost.gasUsed;
    transactionRequest.gasPrice = txCost.gasPrice;
    return transactionRequest;
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

export async function getTxCost(
  transactionRequest: TransactionRequest,
  wallet: WalletLocked | WalletUnlocked
) {
  const receipts = await TxService.simulateTransaction({
    transactionRequest,
    providerUrl: wallet.provider.url,
  });

  const getOpts = {
    receipts,
    gasPerByte: GAS_PER_BYTE,
    gasPriceFactor: GAS_PRICE_FACTOR,
  };

  const transaction = transactionRequest.toTransaction();
  const fee = getFee({ transaction, ...getOpts });
  const gasUsed = getGasUsed({ transaction, ...getOpts });

  return {
    fee,
    gasUsed,
    gasPrice: transactionRequest.gasPrice,
  };
}
