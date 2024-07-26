import type { Account } from '@fuel-wallet/types';
import type { TransactionRequest, WalletLocked } from 'fuels';

import {
  Address,
  type BN,
  Provider,
  TransactionResponse,
  TransactionStatus,
  assembleTransactionSummary,
  bn,
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
    transactionRequest?: TransactionRequest;
    providerUrl?: string;
    tip?: BN;
    gasLimit?: BN;
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
    tip,
    gasLimit,
  }: TxInputs['simulateTransaction']) {
    const provider = await Provider.create(providerUrl || '');
    const account = await AccountService.getCurrentAccount();

    if (!transactionRequest) {
      throw new Error('Missing transaction request');
    }
    if (!account) {
      throw new Error('Missing context for transaction request');
    }

    try {
      const wallet = new WalletLockedCustom(account.address, provider);

      // Set the gas limit and tip if provided
      if ('gasLimit' in transactionRequest && gasLimit) {
        transactionRequest.gasLimit = gasLimit;
      }
      if ('tip' in transactionRequest && tip) {
        transactionRequest.tip = tip;
      }
      const baseFee = transactionRequest.maxFee.sub(
        transactionRequest.tip ?? bn(0)
      );

      const txCost = await provider.getTransactionCost(transactionRequest, {
        estimateTxDependencies: true,
        resourcesOwner: wallet,
      });

      await wallet.fund(transactionRequest, txCost);

      const transaction = transactionRequest.toTransaction();
      const abiMap = await getAbiMap({
        inputs: transaction.inputs,
      });

      const txSummary = await getTransactionSummaryFromRequest({
        provider,
        transactionRequest,
        abiMap,
      });

      return {
        baseFee: baseFee.sub(1), // To match maxFee calculated on TS SDK (they add 1 unit)
        minGasLimit: txCost.gasUsed,
        txSummary,
      };

      // biome-ignore lint/suspicious/noExplicitAny: allow any
    } catch (e: any) {
      const { gasPerByte, gasPriceFactor, gasCosts, maxGasPerTx } =
        provider.getGasConfig();
      const consensusParameters = provider.getChain().consensusParameters;
      const { maxInputs } = consensusParameters.txParameters;

      const transaction = transactionRequest.toTransaction();
      const transactionBytes = transactionRequest.toTransactionBytes();

      const abiMap = await getAbiMap({
        inputs: transaction.inputs,
      });

      const errorsToParse =
        e.name === 'FuelError' ? [{ message: e.message }] : e.response?.errors;
      const simulateTxErrors = getGroupedErrors(errorsToParse);

      const gasPrice = await provider.getLatestGasPrice();
      const baseAssetId = provider.getBaseAssetId();
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
        baseAssetId,
      });
      txSummary.isStatusFailure = true;
      txSummary.status = TransactionStatus.failure;

      return {
        baseFee: undefined,
        minGasLimit: undefined,
        txSummary,
        simulateTxErrors,
      };
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

  static async estimateDefaultTips() {
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const provider = await Provider.create(currentNetwork?.url || '');

    const { regularTip, fastTip } = await getCurrentTips(provider);

    return {
      regularTip: bn(regularTip),
      fastTip: bn(fastTip),
    };
  }

  static async estimateGasLimit() {
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const provider = await Provider.create(currentNetwork?.url || '');
    const consensusParameters = provider.getChain().consensusParameters;

    return {
      maxGasLimit: consensusParameters.txParameters.maxGasPerTx,
    };
  }

  static async createTransfer(input: TxInputs['createTransfer'] | undefined) {
    const { amount, assetId, to, tip, gasLimit } = input || {};

    if (!to || !assetId || !amount || !tip || !gasLimit) {
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

    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const targetAmount = amount.sub(attempts * 1_000_000);
        const realAmount = targetAmount.gt(0) ? targetAmount : bn(1);
        const transactionRequest = await wallet.createTransfer(
          Address.fromDynamicInput(to),
          realAmount,
          assetId,
          {
            tip: tip.isZero() ? undefined : tip,
            gasLimit: gasLimit.isZero() ? undefined : gasLimit,
          }
        );

        const txCost = await provider.getTransactionCost(transactionRequest, {
          resourcesOwner: wallet,
        });

        const baseFee = transactionRequest.maxFee.sub(
          transactionRequest.tip ?? bn(0)
        );

        return {
          baseFee: baseFee.sub(1), // To match maxFee calculated on TS SDK (they add 1 unit)
          minGasLimit: txCost.gasUsed,
          transactionRequest,
          address: account.address,
          providerUrl: network.url,
        };
      } catch (e) {
        attempts += 1;

        // @TODO: Waiting to match with FuelError type and ErrorCode enum from "fuels"
        // These types are not exported from "fuels" package, but they exists in the "@fuels-ts/errors"
        if (
          e instanceof Error &&
          'toObject' in e &&
          typeof e.toObject === 'function'
        ) {
          const error: { code: string } = e.toObject();

          if (error.code === 'gas-limit-too-low') {
            throw e;
          }
        }
      }
    }

    return {
      baseFee: undefined,
      minGasLimit: undefined,
      transactionRequest: undefined,
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
