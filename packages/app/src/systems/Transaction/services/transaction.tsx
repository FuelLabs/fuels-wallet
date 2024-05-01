import type { Account } from '@fuel-wallet/types';
import type { TransactionRequest, WalletLocked } from 'fuels';

import {
  Address,
  type BN,
  Provider,
  ScriptTransactionRequest,
  TransactionResponse,
  TransactionStatus,
  assembleTransactionSummary,
  bn,
  coinQuantityfy,
  getTransactionSummary,
  getTransactionSummaryFromRequest,
  getTransactionsSummaries,
  normalizeJSON,
} from 'fuels';
import { WalletLockedCustom, db, uniqueId } from '~/systems/Core';

import { AccountService } from '~/systems/Account/services/account';
import { NetworkService } from '~/systems/Network/services/network';
import type { Transaction } from '../types';
import { getAbiMap, getGroupedErrors } from '../utils';
import { getCurrentTips } from '../utils/fee';

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
    to?: string;
    amount?: BN;
    assetId?: string;
    tip?: BN;
    gasLimit?: BN;
  };
  applyFee: {
    transactionRequest?: TransactionRequest;
  };
  fetch: {
    txId: string;
    providerUrl?: string;
  };
  getTransactionHistory: {
    address: string;
    providerUrl?: string;
  };
  fundTransaction: {
    wallet: WalletLocked;
    transactionRequest: TransactionRequest;
  };
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
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
    return { txResult: txResultWithCalls, txResponse };
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

    try {
      const txSummary = await getTransactionSummaryFromRequest({
        provider,
        transactionRequest,
        abiMap,
      });

      return { txSummary };

      // biome-ignore lint/suspicious/noExplicitAny: allow any
    } catch (e: any) {
      const { gasPerByte, gasPriceFactor, gasCosts, maxGasPerTx } =
        provider.getGasConfig();
      const maxInputs = provider.getChain().consensusParameters.maxInputs;

      const transaction = transactionRequest.toTransaction();
      const transactionBytes = transactionRequest.toTransactionBytes();

      const simulateTxErrors = getGroupedErrors(e.response?.errors);
      const gasPrice = await provider.getLatestGasPrice();
      const txSummary = assembleTransactionSummary({
        receipts: [],
        transaction,
        transactionBytes,
        abiMap,
        gasPerByte,
        gasPriceFactor,
        maxInputs,
        gasCosts,
        maxGasPerTx,
        gasPrice,
      });
      txSummary.isStatusFailure = true;
      txSummary.status = TransactionStatus.failure;

      return { txSummary, simulateTxErrors };
    }
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

  static async estimateInitialFee() {
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const provider = await Provider.create(currentNetwork?.url || '');
    const baseAssetId = provider.getBaseAssetId();
    const request = new ScriptTransactionRequest();
    const address = Address.fromRandom();

    const coin = coinQuantityfy([1_000_000, baseAssetId]);
    request.addCoinOutput(address, coin.amount, coin.assetId);
    const { maxFee } = await provider.getTransactionCost(request, {
      estimateTxDependencies: true,
    });

    const { regularTip, fastTip } = await getCurrentTips(provider);

    return {
      baseFee: maxFee,
      regularTip: bn(regularTip),
      fastTip: bn(fastTip),
      baseAssetId,
      maxGasPerTx: provider.getChain().consensusParameters.maxGasPerTx,
    };
  }

  static async createTransfer(input: TxInputs['createTransfer'] | undefined) {
    const { amount, assetId, to, tip, gasLimit: gasLimitInput } = input || {};

    if (!to || !assetId || !amount || !tip || !gasLimitInput) {
      throw new Error('Missing params for transaction request');
    }

    const [network, account] = await Promise.all([
      NetworkService.getSelectedNetwork(),
      AccountService.getCurrentAccount(),
    ]);

    if (!network?.url || !account) {
      throw new Error('Missing context for transaction request');
    }

    const provider = await Provider.create(network.url);
    const wallet = new WalletLockedCustom(account.address, provider);

    const transactionRequest = await wallet.createTransfer(
      to,
      amount,
      assetId,
      {
        tip,
        gasLimit: gasLimitInput.gt(0) ? gasLimitInput : undefined,
      }
    );

    const { maxFee, gasLimit } = await provider.estimateTxGasAndFee({
      transactionRequest,
    });

    return {
      baseFee: maxFee.sub(transactionRequest.tip),
      gasLimit,
      transactionRequest,
      address: account.address,
      providerUrl: network.url,
    };
  }
}

export function getAssetAccountBalance(account: Account, assetId: string) {
  const balances = account.balances || [];
  const asset = balances.find((balance) => balance.assetId === assetId);
  return bn(asset?.amount);
}
