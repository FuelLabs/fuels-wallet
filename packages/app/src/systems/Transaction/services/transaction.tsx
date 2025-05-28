import type {
  Account,
  AccountWithBalance,
  FuelProviderConfig,
} from '@fuel-wallet/types';
import type {
  Operation,
  OperationCoin,
  TransactionRequest,
  TransactionSummary,
  TransactionSummaryJson,
  WalletLocked,
} from 'fuels';
import { clone, equals } from 'ramda';

import {
  Address,
  type BN,
  ErrorCode,
  FuelError,
  Provider,
  TransactionResponse,
  TransactionStatus,
  assembleTransactionSummary,
  assembleTransactionSummaryFromJson,
  bn,
  getTransactionSummary,
  getTransactionSummaryFromRequest,
  getTransactionsSummaries,
  transactionRequestify,
} from 'fuels';
import { WalletLockedCustom, db, delay } from '~/systems/Core';

import { createProvider } from '@fuel-wallet/connections';
import { AccountService } from '~/systems/Account/services/account';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { graphqlRequest } from '~/systems/Core/utils/graphql';
import { NetworkService } from '~/systems/Network/services/network';
import type { TransactionCursor } from '../types';
import {
  type GroupedErrors,
  getAbiMap,
  getErrorMessage,
  getGasLimitFromTxRequest,
  setGasLimitToTxRequest,
} from '../utils';
import { getCurrentTips } from '../utils/fee';
import { type GetPageInfoQuery, getPageInfoQuery } from './queries';

export type TxInputs = {
  getTxCursors: {
    address: string;
    providerUrl: string;
  };
  addTxCursors: {
    address: string;
    providerUrl: string;
    cursors: string[];
  };
  request: {
    providerConfig: FuelProviderConfig;
    transactionRequest: TransactionRequest;
    address?: string;
    origin?: string;
    title?: string;
    favIconUrl?: string;
    account?: AccountWithBalance;
    skipCustomFee?: boolean;
    fees?: {
      baseFee?: BN;
      regularTip?: BN;
      fastTip?: BN;
      maxGasLimit?: BN;
    };
    transactionState?: 'funded' | undefined;
    transactionSummary?: TransactionSummaryJson;
    signOnly?: boolean;
  };
  send: {
    address?: string;
    account?: Account;
    transactionRequest: TransactionRequest;
    providerUrl?: string;
    providerConfig?: FuelProviderConfig;
    origin?: string;
  };
  simulateTransaction: {
    transactionRequest: TransactionRequest;
    providerConfig?: FuelProviderConfig;
    skipCustomFee?: boolean;
    tip?: BN;
    gasLimit?: BN;
    transactionState?: 'funded' | undefined;
    transactionSummary?: TransactionSummaryJson;
  };
  setCustomFees: {
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
    pagination?: {
      after: string | null;
    };
  };
  getAllCursors: {
    address: string;
    providerUrl?: string;
    initialEndCursor: string | null;
  };
  fundTransaction: {
    wallet: WalletLocked;
    transactionRequest: TransactionRequest;
  };
  computeCustomFee: {
    wallet: WalletLocked;
    transactionRequest: TransactionRequest;
  };
};

const AMOUNT_SUB_PER_TX_RETRY = 300_000;
const TXS_PER_PAGE = 50;

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class TxService {
  static getTxCursors(input: TxInputs['getTxCursors']) {
    return db.transaction('r', db.transactionsCursors, async () => {
      return db.transactionsCursors
        .where('providerUrl')
        .equalsIgnoreCase(input.providerUrl)
        .and((cursor) => {
          return cursor.address.toLowerCase() === input.address.toLowerCase();
        })
        .and((cursor) => {
          return cursor.size === TXS_PER_PAGE;
        })
        .sortBy('id');
    });
  }

  static addTxCursors(input: TxInputs['addTxCursors']) {
    const { address, providerUrl, cursors } = input;

    const transactionsCursors: TransactionCursor[] = cursors.map(
      (endCursor) => ({
        address,
        size: TXS_PER_PAGE,
        providerUrl,
        endCursor,
      })
    );

    return db.transaction('rw', db.transactionsCursors, async () => {
      await db.transactionsCursors.bulkAdd(transactionsCursors);
      return true;
    });
  }

  static async sign({
    account,
    address,
    transactionRequest,
    providerUrl = '',
    providerConfig,
  }: Omit<TxInputs['send'], 'signOnly'>) {
    const provider = await createProvider(
      providerUrl || providerConfig?.url || ''
    );
    const wallet = new WalletLockedCustom(
      (account?.address?.toString() || address) as string,
      provider
    );

    const txRequest =
      await wallet.populateTransactionWitnessesSignature(transactionRequest);

    return txRequest;
  }

  static async send({
    account,
    address,
    transactionRequest,
    providerUrl = '',
    providerConfig,
  }: Omit<TxInputs['send'], 'signOnly'>) {
    const provider = await createProvider(
      providerUrl || providerConfig?.url || ''
    );
    const wallet = new WalletLockedCustom(
      (account?.address?.toString() || address) as string,
      provider
    );

    const txSent = await wallet.sendTransaction(transactionRequest);
    return txSent;
  }

  static async fetch({ txId, providerUrl = '' }: TxInputs['fetch']) {
    const provider = await createProvider(providerUrl);
    const txResult = await getTransactionSummary({ id: txId, provider });
    const chainId = await provider.getChainId();
    const txResponse = new TransactionResponse(txId, provider, chainId);
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
    skipCustomFee,
    transactionRequest: inputTransactionRequest,
    providerConfig,
    tip: inputCustomTip,
    gasLimit: inputCustomGasLimit,
    transactionState,
  }: TxInputs['simulateTransaction']) {
    const provider = new Provider(providerConfig?.url || '', {
      cache: providerConfig?.cache,
    });

    if (!inputTransactionRequest) {
      throw new Error('Missing transaction request');
    }

    try {
      let baseFee: BN | undefined = undefined;
      /*
      we'll work always based on the first inputted transactionRequest, then cloning it and manipulating
      then outputting a proposedTxRequest, which will be the one to go for approval
      */
      const proposedTxRequest = clone(inputTransactionRequest);

      if (!skipCustomFee) {
        const account = await AccountService.getCurrentAccount();
        if (!account) {
          throw new Error('Missing context for transaction request');
        }
        const wallet = new WalletLockedCustom(account.address, provider);
        const initialMaxFee = inputTransactionRequest.maxFee;

        if (
          inputCustomTip ||
          inputCustomGasLimit ||
          transactionState !== 'funded'
        ) {
          // if the user has inputted a custom tip, we set it to the proposedTxRequest
          if (inputCustomTip) {
            proposedTxRequest.tip = inputCustomTip;
          }
          // if the user has inputted a custom gas Limit, we set it to the proposedTxRequest
          if (inputCustomGasLimit) {
            setGasLimitToTxRequest(proposedTxRequest, inputCustomGasLimit);
          }

          const { maxFee } = await provider.estimateTxGasAndFee({
            transactionRequest: proposedTxRequest,
          });
          // if the maxFee is greater than the initial maxFee, we set it to the new maxFee, and refund the transaction
          if (maxFee.gt(initialMaxFee)) {
            proposedTxRequest.maxFee = maxFee;
            const txCost = await wallet.getTransactionCost(proposedTxRequest, {
              estimateTxDependencies: true,
            });
            await wallet.fund(proposedTxRequest, {
              estimatedPredicates: txCost.estimatedPredicates,
              addedSignatures: txCost.addedSignatures,
              gasPrice: txCost.gasPrice,
              updateMaxFee: txCost.updateMaxFee,
              requiredQuantities: [],
            });
          }
        }

        baseFee = proposedTxRequest.maxFee.sub(proposedTxRequest.tip ?? bn(0));
      }

      const transaction = proposedTxRequest.toTransaction();
      const abiMap = await getAbiMap({
        inputs: transaction.inputs,
      });

      const txSummary = await getTransactionSummaryFromRequest({
        provider,
        transactionRequest: proposedTxRequest,
        abiMap,
      });

      // Adding 1 magical unit to match the fake unit that is added on TS SDK (.add(1))
      const feeAdaptedToSdkDiff = txSummary.fee.add(1);
      const [chainId, baseAssetId] = await Promise.all([
        provider.getChainId(),
        provider.getBaseAssetId(),
      ]);
      const baseAsset = await AssetsCache.getInstance().getAsset({
        chainId: chainId,
        assetId: baseAssetId,
        dbAssets: [],
        save: false,
      });
      const feeInUsd =
        baseAsset != null
          ? convertToUsd(
              feeAdaptedToSdkDiff,
              baseAsset?.decimals,
              // biome-ignore lint/suspicious/noExplicitAny: @fuel-ts/accounts types are not updated
              (baseAsset as any)?.rate
            ).formatted
          : '$0';
      return {
        baseFee,
        txSummary: {
          ...txSummary,
          fee: feeAdaptedToSdkDiff,
          feeInUsd,
        },
        proposedTxRequest,
      };
    } catch (e) {
      const { gasPerByte, gasPriceFactor, gasCosts, maxGasPerTx } =
        await provider.getGasConfig();
      const consensusParameters = (await provider.getChain())
        .consensusParameters;
      const { maxInputs } = consensusParameters.txParameters;

      const transaction = inputTransactionRequest.toTransaction();
      const transactionBytes = inputTransactionRequest.toTransactionBytes();

      const abiMap = await getAbiMap({
        inputs: transaction.inputs,
      });

      const simulateTxErrors: GroupedErrors =
        e instanceof FuelError ? getErrorMessage(e) : 'Unknown error';

      const gasPrice = await provider.getLatestGasPrice();
      const baseAssetId = await provider.getBaseAssetId();
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
        id: '',
      });
      txSummary.isStatusFailure = true;
      txSummary.status = TransactionStatus.failure;

      // Fallback to the values from the transactionRequest
      if ('gasLimit' in inputTransactionRequest) {
        txSummary.gasUsed = inputTransactionRequest.gasLimit;
      }

      return {
        baseFee: txSummary.fee.add(1),
        txSummary,
        simulateTxErrors,
        proposedTxRequest: inputTransactionRequest,
      };
    }
  }

  static async getTransactionHistory({
    address,
    providerUrl = '',
    pagination,
  }: TxInputs['getTransactionHistory']) {
    const provider = await createProvider(providerUrl);
    const txSummaries = await getTransactionsSummaries({
      provider,
      filters: {
        owner: address,
        first: TXS_PER_PAGE,
        after: pagination?.after,
      },
    });

    return {
      transactionHistory: txSummaries.transactions,
      pageInfo: txSummaries.pageInfo,
    };
  }

  static async getAllCursors({
    address,
    providerUrl = '',
    initialEndCursor,
  }: TxInputs['getAllCursors']) {
    let hasNextPage = true;
    const cursors: string[] = [];
    let endCursor: string | null | undefined = initialEndCursor;

    while (hasNextPage) {
      const result: GetPageInfoQuery = await graphqlRequest(
        providerUrl,
        'getTransactionsByOwner',
        getPageInfoQuery,
        {
          owner: address,
          first: TXS_PER_PAGE,
          after: endCursor,
        }
      );
      const pageInfo = result.transactionsByOwner.pageInfo;

      hasNextPage = pageInfo.hasNextPage;
      endCursor = pageInfo.endCursor;

      if (hasNextPage && endCursor) {
        cursors.push(endCursor);
      }
    }

    return {
      cursors,
    };
  }

  static async estimateGasLimitAndDefaultTips() {
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const provider = await createProvider(currentNetwork?.url || '');
    const [{ regularTip, fastTip }, { consensusParameters }] =
      await Promise.all([getCurrentTips(provider), provider.getChain()]);
    return {
      regularTip: bn(regularTip),
      fastTip: bn(fastTip),
      maxGasLimit: consensusParameters.txParameters.maxGasPerTx,
    };
  }

  static async estimateGasLimit() {
    const currentNetwork = await NetworkService.getSelectedNetwork();
    const provider = await createProvider(currentNetwork?.url || '');
    const consensusParameters = (await provider.getChain()).consensusParameters;

    return {
      maxGasLimit: consensusParameters.txParameters.maxGasPerTx,
    };
  }

  static async createTransfer(input: TxInputs['createTransfer'] | undefined) {
    const { amount, assetId, to, tip, gasLimit } = input || {};

    if (!to || !assetId || !amount || !tip || !gasLimit) {
      throw new Error('Missing params for transaction request');
    }

    if (amount.lte(0)) {
      throw new Error('Amount must be greater than 0');
    }

    const [network, account] = await Promise.all([
      NetworkService.getSelectedNetwork(),
      AccountService.getCurrentAccount(),
    ]);

    if (!network?.url || !account) {
      throw new Error('Missing context for transaction request');
    }

    const provider = await createProvider(network.url);
    const wallet = new WalletLockedCustom(account.address, provider);

    const maxAttempts = 20;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const targetAmount = amount.sub(attempts * AMOUNT_SUB_PER_TX_RETRY);
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

        const baseFee = transactionRequest.maxFee.sub(
          transactionRequest.tip ?? bn(0)
        );

        return {
          baseFee,
          gasLimit: getGasLimitFromTxRequest(transactionRequest),
          transactionRequest,
          address: account.address,
          providerUrl: network.url,
        };
      } catch (e) {
        attempts += 1;

        if (e instanceof FuelError) {
          const error = e.toObject();

          // If the gas limit is too low, we cannot move forward
          if (error.code === ErrorCode.GAS_LIMIT_TOO_LOW) {
            throw e;
          }

          // If this is the last attempt and we still don't have funds, we cannot move forward
          if (
            attempts === maxAttempts &&
            error.code === ErrorCode.INSUFFICIENT_FUNDS_OR_MAX_COINS
          ) {
            throw e;
          }
        }
      }
    }

    return {
      baseFee: undefined,
      gasLimit: undefined,
      transactionRequest: undefined,
      address: account.address,
      providerUrl: network.url,
    };
  }
}
