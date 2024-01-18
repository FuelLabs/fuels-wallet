import type { Account, AssetData } from '@fuel-wallet/types';
import type {
  GetTransactionSummaryFromRequestParams,
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
  Provider,
  getTransactionSummary,
  TransactionResponse,
  getTransactionsSummaries,
  assembleTransactionSummary,
  hexlify,
  processGqlReceipt,
  BN,
} from 'fuels';
import { isEth } from '~/systems/Asset/utils/asset';
import { db, uniqueId, WalletLockedCustom } from '~/systems/Core';

import type { Transaction } from '../types';
import { getAbiMap } from '../utils';

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
  resolveTransferCosts: {
    amount: BN;
    assetId: string;
    account: Account;
    provider: Provider;
    transferRequest: ScriptTransactionRequest;
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
    asset?: AssetData;
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
    const {
      consensusParameters: { gasPerByte, gasPriceFactor, maxInputs, gasCosts },
    } = provider.getChain();

    const transactionSummary = assembleTransactionSummary<TTransactionType>({
      gasCosts,
      transaction,
      transactionBytes,
      abiMap,
      receipts,
      gasPerByte,
      gasPriceFactor,
      maxInputs,
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

  static async createTransfer(input: TxInputs['createTransfer']) {
    const { minGasPrice: gasPrice } = await input.provider.getGasConfig();
    // Because gasLimit is caulculated on the number of operations we can
    // safely assume that a transfer will consume at max 20 units, this should
    // be change once we add multiple transfers in a single transaction.
    const request = new ScriptTransactionRequest({ gasLimit: 20, gasPrice });
    const to = Address.fromAddressOrString(input.to);
    const { assetId, amount } = input;
    request.addCoinOutput(to, amount, assetId);
    return request;
  }

  static async resolveTransferCosts(input: TxInputs['resolveTransferCosts']) {
    try {
      const { account, amount, assetId, provider, transferRequest } = input;
      const wallet = new WalletLockedCustom(account.address, provider);
      const nativeBalance = await wallet.getBalance();
      let fee = new BN(0);
      // If transaction is native asset and amount is equal to balance
      // them we calculate the fee for the screen to reduce the input amount
      if (assetId === BaseAssetId && amount.eq(nativeBalance)) {
        const resources = await provider.getResourcesToSpend(wallet.address, [
          {
            assetId: BaseAssetId,
            amount: nativeBalance,
          },
        ]);
        transferRequest.addResources(resources);
        const { gasUsed, gasPrice, usedFee, minFee } =
          await provider.getTransactionCost(transferRequest);
        transferRequest.gasPrice = gasPrice;
        transferRequest.gasLimit = gasUsed;
        fee = usedFee.add(minFee);
      } else {
        const { requiredQuantities, gasPrice, gasUsed, usedFee, minFee } =
          await provider.getResourcesForTransaction(
            wallet.address,
            transferRequest
          );
        fee = usedFee.add(minFee);
        // If does not find ETH on the required coins add it before query resources
        // TODO: check why the getResourcesForTransaction from TS-SDK do not return
        // the ETH required on the requiredQuantities
        if (
          !requiredQuantities.find(
            (quantity) => quantity.assetId === BaseAssetId
          )
        ) {
          requiredQuantities.push({
            assetId: BaseAssetId,
            amount: fee,
          });
        }
        const resources = await provider.getResourcesToSpend(
          wallet.address,
          requiredQuantities
        );
        transferRequest.gasPrice = gasPrice;
        transferRequest.gasLimit = gasUsed;
        transferRequest.addResources(resources);
      }

      return {
        fee,
        transactionRequest: transferRequest,
      };
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('not enough coins to fit the target')) {
          throw new Error('Insufficient funds to cover gas costs');
        }
      }
      throw err;
    }
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
