import type { Account, AssetData } from '@fuel-wallet/types';
import type {
  Account as FuelsAccount,
  GetTransactionSummaryFromRequestParams,
  TransactionRequest,
  TransactionSummary,
  WalletLocked,
} from 'fuels';

import {
  Address,
  type BN,
  BaseAssetId,
  PolicyType,
  Provider,
  ScriptTransactionRequest,
  TransactionResponse,
  TransactionStatus,
  addressify,
  assembleTransactionSummary,
  bn,
  coinQuantityfy,
  getTransactionSummary,
  getTransactionSummaryFromRequest,
  getTransactionsSummaries,
  hexlify,
  normalizeJSON,
  processGqlReceipt,
} from 'fuels';
import { isEth } from '~/systems/Asset/utils/asset';
import { WalletLockedCustom, db, uniqueId } from '~/systems/Core';

import { AccountService } from '~/systems/Account/services/account';
import { NetworkService } from '~/systems/Network/services/network';
import type { Transaction } from '../types';
import { getAbiMap } from '../utils';
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
    tip?: BN;
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
      encodedTransactions: hexlify(transactionBytes),
      utxoValidation: false,
    });
    const receipts = gqlReceipts[0].receipts.map(processGqlReceipt);
    const {
      consensusParameters: {
        gasPerByte,
        gasPriceFactor,
        maxInputs,
        gasCosts,
        maxGasPerTx,
      },
    } = provider.getChain();
    const gasPrice = await provider.getLatestGasPrice();

    const transactionSummary = assembleTransactionSummary<TTransactionType>({
      gasCosts,
      transaction,
      transactionBytes,
      abiMap,
      receipts,
      gasPerByte,
      gasPriceFactor,
      maxInputs,
      maxGasPerTx,
      gasPrice,
    });

    // Workaround until https://github.com/FuelLabs/fuels-ts/issues/1674 is fixed
    transactionSummary.isStatusFailure = transactionSummary.receipts.some(
      (receipt) => {
        return receipt.type === 3;
      }
    );
    if (transactionSummary.isStatusFailure) {
      transactionSummary.status = TransactionStatus.failure;
    }

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
    const txResult = await getTransactionSummaryFromRequest({
      provider,
      transactionRequest,
      abiMap,
    });
    // const txResult = await TxService.getTransactionSummaryFromRequest({
    //   transactionRequest,
    //   provider,
    //   abiMap,
    // });

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

  static async estimateInitialFee() {
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const provider = await Provider.create(currentNetwork?.url || '');
    const request = new ScriptTransactionRequest();
    const address = Address.fromRandom();

    const coin = coinQuantityfy([1_000_000, BaseAssetId]);
    request.addCoinOutput(address, coin.amount, coin.assetId);
    const { maxFee } = await provider.getTransactionCost(request, {
      estimateTxDependencies: true,
    });

    const { regularTip, fastTip } = await getCurrentTips(provider);

    return { maxFee, regularTip: bn(regularTip), fastTip: bn(fastTip) };
  }

  static async createTransfer(input: TxInputs['createTransfer']) {
    const { amount, assetId, to, tip } = input;

    const [network, account] = await Promise.all([
      NetworkService.getSelectedNetwork(),
      AccountService.getCurrentAccount(),
    ]);

    if (!to || !assetId || !amount || !network?.url || !account || !tip) {
      throw new Error('Missing params for transaction request');
    }

    const provider = await Provider.create(network.url);
    const wallet = new WalletLockedCustom(account.address, provider);
    const transactionRequest = await wallet.createTransfer(to, amount, assetId);
    const { maxFee, gasLimit } = await provider.estimateTxGasAndFee({
      transactionRequest,
    });
    transactionRequest.tip = tip;
    transactionRequest.maxFee = maxFee.add(tip);

    return {
      maxFee,
      gasLimit,
      transactionRequest,
      address: account.address,
      providerUrl: network.url,
    };
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
    // const { minGasPrice } = await input.wallet.provider.fetchNode();
    const transactionRequest = await TxService.addResources({
      ...input,
      // gasFee: minGasPrice,
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
