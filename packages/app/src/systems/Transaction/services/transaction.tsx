import { getGasConfig } from '@fuel-wallet/sdk';
import type { Account, Asset } from '@fuel-wallet/types';
import type {
  BN,
  GetTransactionSummaryFromRequestParams,
  ScriptTransactionRequestLike,
  TransactionRequest,
  TransactionSummary,
  WalletLocked,
} from 'fuels';
import {
  normalizeJSON,
  Address,
  bn,
  BaseAssetId,
  ScriptTransactionRequest,
  transactionRequestify,
  Provider,
  getTransactionSummary,
  TransactionResponse,
  getTransactionsSummaries,
  assembleTransactionSummary,
  hexlify,
  processGqlReceipt,
  arrayify,
} from 'fuels';
import { AccountService } from '~/systems/Account';
import { isEth } from '~/systems/Asset';
import { db, uniqueId, WalletLockedCustom } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import type { Transaction } from '../types';
import { getAbiMap } from '../utils';
import { calculateTotalFee } from '../utils/fee';

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
    provider: Provider;
  };
  fetch: {
    txId: string;
    providerUrl?: string;
  };
  getTransactionHistory: {
    address: string;
    providerUrl?: string;
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

    const data = normalizeJSON(input.data!);
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
    const provider = await Provider.create(providerUrl);
    const wallet = new WalletLockedCustom(address, provider);
    const txSent = await wallet.sendTransaction(transactionRequest);

    return txSent;
  }

  static async fetch({ txId, providerUrl = '' }: TxInputs['fetch']) {
    const provider = await Provider.create(providerUrl);
    const { gasPerByte, gasPriceFactor } = await provider.getGasConfig();
    const txResult = await getTransactionSummary({ id: txId, provider });
    const txResponse = new TransactionResponse(txId, provider);

    // TODO: remove this when we get SDK with new TransactionResponse flow
    const abiMap = await getAbiMap({
      inputs: txResult.transaction.inputs,
    });
    const txResultWithCalls = await getTransactionSummary({
      id: txId,
      provider,
      abiMap,
    });

    // TODO: remove this once is fixed on the SDK
    // https://github.com/FuelLabs/fuels-ts/issues/1314
    let bytesUsed = 0;
    try {
      const byteSize = arrayify(
        txResultWithCalls.gqlTransaction.rawPayload
      ).length;
      const witnessesSize =
        txResultWithCalls.transaction?.witnesses?.reduce((t, w) => {
          return t + w.dataLength;
        }, 0) || 0;
      bytesUsed = byteSize - witnessesSize;
    } catch (err) {
      bytesUsed = 0;
    }

    // gasPrice
    txResultWithCalls.fee = await calculateTotalFee({
      gasPerByte,
      gasPriceFactor,
      gasUsed: txResultWithCalls.gasUsed,
      gasPrice: bn(txResultWithCalls.transaction.gasPrice),
      bytesUsed: bn(bytesUsed),
    });

    return { txResult: txResultWithCalls, txResponse };
  }

  // TODO: remove this once is fixed on the SDK
  // https://github.com/FuelLabs/fuels-ts/issues/1314
  static async getTransactionSummaryFromRequest<TTransactionType = void>(
    params: GetTransactionSummaryFromRequestParams
  ): Promise<TransactionSummary<TTransactionType>> {
    const { provider, transactionRequest, abiMap } = params;
    await provider.estimateTxDependencies(transactionRequest);
    const transaction = transactionRequest.toTransaction();
    const transactionBytes = transactionRequest.toTransactionBytes();
    const { dryRun: gqlReceipts } = await provider.operations.dryRun({
      encodedTransaction: hexlify(transactionBytes),
      utxoValidation: false,
    });
    const receipts = gqlReceipts.map(processGqlReceipt);
    const { gasPerByte, gasPriceFactor } = provider.getGasConfig();
    const transactionSummary = assembleTransactionSummary<TTransactionType>({
      receipts,
      transaction,
      transactionBytes,
      abiMap,
      gasPerByte,
      gasPriceFactor,
      maxInputs: bn(255),
    });
    transactionSummary.fee = await calculateTotalFee({
      gasPerByte,
      gasPriceFactor,
      gasPrice: transaction.gasPrice,
      gasUsed: transactionSummary.gasUsed,
      bytesUsed: bn(transactionBytes.length),
    });
    return transactionSummary;
  }

  static async simulateTransaction({
    transactionRequest,
    providerUrl,
  }: TxInputs['simulateTransaction']) {
    const provider = await Provider.create(providerUrl || '');
    const transaction = transactionRequest.toTransaction();
    const abiMap = await getAbiMap({
      inputs: transaction.inputs,
    });
    const txResult = await TxService.getTransactionSummaryFromRequest({
      transactionRequest,
      provider,
      abiMap,
    });

    return { txResult };
  }

  static async getTransactionHistory({
    address,
    providerUrl = '',
  }: TxInputs['getTransactionHistory']) {
    const provider = await Provider.create(providerUrl || '');

    const txSummaries = await getTransactionsSummaries({
      provider,
      filters: {
        owner: address,
        first: 1000,
      },
    });

    const sortedTransactions = txSummaries.transactions?.sort((a, b) => {
      const aTime = bn(a.time, 10);
      const bTime = bn(b.time, 10);
      return aTime.gt(bTime) ? -1 : 1;
    });

    return {
      transactionHistory: sortedTransactions,
      pageInfo: txSummaries.pageInfo,
    };
  }

  static async createFakeTx() {
    const [account, network] = await Promise.all([
      AccountService.getCurrentAccount(),
      NetworkService.getSelectedNetwork(),
    ]);
    const provider = await Provider.create(network!.url);
    const wallet = new WalletLockedCustom(account!.address, provider);
    const { gasLimit, gasPrice } = await getGasConfig(wallet.provider);
    const params: ScriptTransactionRequestLike = { gasLimit, gasPrice };
    const request = new ScriptTransactionRequest(params);
    request.addCoinOutput(wallet.address, bn(1), BaseAssetId);
    const { maxFee, requiredQuantities } =
      await provider.getTransactionCost(request);
    await wallet.fund(request, requiredQuantities, maxFee);

    const { txResult } = await TxService.simulateTransaction({
      transactionRequest: request,
      providerUrl: wallet.provider.url,
    });

    return {
      txResult,
    };
  }

  static async createTransfer(input: TxInputs['createTransfer']) {
    const { gasPrice } = await getGasConfig(input.provider);
    // Because gasLimit is caulculated on the number of operations we can
    // safely assume that a transfer will consume at max 20 units, this should
    // be change once we add multiple transfers in a single transaction.
    const request = new ScriptTransactionRequest({ gasLimit: 20, gasPrice });
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
        assetId: BaseAssetId,
        amount: gasFee,
      });
    }

    const resources = await wallet.getResourcesToSpend(coins);
    request.addResources(resources);
    return request;
  }

  static async fundTransaction(input: TxInputs['fundTransaction']) {
    const { minGasPrice } = await input.wallet.provider.fetchNode();
    const transactionRequest = await TxService.addResources({
      ...input,
      gasFee: minGasPrice,
    });
    return transactionRequest;
  }

  static isValidTransaction(input: TxInputs['isValidTransaction']) {
    const { account, asset, fee, amount, address } = input;
    if (!account || !asset || !fee || !amount || !address) return false;
    const assetBalance = getAssetAccountBalance(account, asset?.assetId);
    if (isEth(asset.assetId)) return assetBalance.gte(bn(amount).add(fee));
    const ethBalance = getAssetAccountBalance(account, BaseAssetId);
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
