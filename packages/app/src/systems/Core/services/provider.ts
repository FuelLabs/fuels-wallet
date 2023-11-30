import type {
  AbstractAddress,
  BN,
  CoinQuantity,
  ProviderOptions,
  ScriptTransactionRequest,
  TransactionCost,
  TransactionCostParams,
  TransactionRequestLike,
  TransactionResultReceipt,
} from 'fuels';
import {
  BaseAssetId,
  Provider,
  TransactionType,
  bn,
  calculatePriceWithFactor,
  getGasUsedFromReceipts,
  max,
  transactionRequestify,
} from 'fuels';
import cloneDeep from 'lodash.clonedeep';

const mergeQuantities = (
  arr1: CoinQuantity[],
  arr2: CoinQuantity[]
): CoinQuantity[] => {
  const resultMap: { [key: string]: BN } = {};

  function addToMap({ amount, assetId }: CoinQuantity) {
    if (resultMap[assetId]) {
      resultMap[assetId] = resultMap[assetId].add(amount);
    } else {
      resultMap[assetId] = amount;
    }
  }

  // Process both arrays
  arr1.forEach(addToMap);
  arr2.forEach(addToMap);

  // Convert the resultMap back to an array
  return Object.entries(resultMap).map(([assetId, amount]) => ({
    assetId,
    amount,
  }));
};

export class AppProvider extends Provider {
  static async create(url: string, options: ProviderOptions = {}) {
    const provider = new AppProvider(url, options);
    await provider.fetchChainAndNodeInfo();
    return provider;
  }

  async getResourcesForTransaction(
    owner: AbstractAddress,
    transactionRequestLike: TransactionRequestLike,
    forwardingQuantities: CoinQuantity[] = []
  ) {
    const transactionRequest = transactionRequestify(
      cloneDeep(transactionRequestLike)
    );
    const transactionCost = await this.getTransactionCost(
      transactionRequest,
      forwardingQuantities
    );
    // Add the required resources to the transaction from the owner
    transactionRequest.addResources(
      await this.getResourcesToSpend(owner, transactionCost.requiredQuantities)
    );
    // Refetch transaction costs with the new resources
    // TODO: we could find a way to avoid fetch estimatePredicates again, by returning the transaction or
    // returning a specific gasUsed by the predicate.
    // Also for the dryRun we could have the same issue as we are going to run twice the dryRun and the
    // estimateTxDependencies as we don't have access to the transaction, maybe returning the transaction would
    // be better.
    const { requiredQuantities, ...txCost } = await this.getTransactionCost(
      transactionRequest,
      forwardingQuantities
    );
    // const resources = await this.getResourcesToSpend(owner, requiredQuantities);

    return {
      // resources,
      requiredQuantities,
      ...txCost,
    };
  }

  async getTransactionCost(
    transactionRequestLike: TransactionRequestLike,
    forwardingQuantities: CoinQuantity[] = [],
    {
      estimateTxDependencies = true,
      estimatePredicates = true,
    }: TransactionCostParams = {}
  ): Promise<TransactionCost> {
    const transactionRequest = transactionRequestify(
      cloneDeep(transactionRequestLike)
    );
    const chainInfo = this.getChain();
    const { minGasPrice } = this.getNode();
    const { maxGasPerTx: gasLimit, gasPriceFactor } =
      chainInfo.consensusParameters;
    const gasPrice = max(transactionRequest.gasPrice, minGasPrice);
    let gasUsed = bn(0);

    /**
     * Estimate predicates gasUsed
     */
    if (transactionRequest.hasPredicateInput() && estimatePredicates) {
      // Remove gasLimit to avoid gasLimit when estimating predicates
      (transactionRequest as ScriptTransactionRequest).gasLimit = bn(0);
      await this.estimatePredicates(transactionRequest);
    }

    /**
     * Calculate minGas and maxGas based on the real transaction
     */
    const minGas = transactionRequest.calculateMinGas(chainInfo);
    const maxGas = gasLimit.sub(minGas);
    // Min gas price now is the minGas;
    gasUsed = minGas;

    /**
     * Fund with fake UTXOs to avoid not enough funds error
     */
    // Getting coin quantities from amounts being transferred
    const coinOutputsQuantities = transactionRequest.getCoinOutputsQuantities();
    // Combining coin quantities from amounts being transferred and forwarding to contracts
    let allQuantities = mergeQuantities(
      coinOutputsQuantities,
      forwardingQuantities
    );
    // Funding transaction with fake utxos
    transactionRequest.fundWithFakeUtxos(allQuantities);

    /**
     * Estimate gasUsed for script transactions
     */
    // Transactions of type Create does not consume any gas so we can the dryRun
    let receipts: TransactionResultReceipt[] = [];
    if (transactionRequest.type === TransactionType.Script) {
      /**
       * Setting the gasPrice to 0 on a dryRun will result in no fees being charged.
       * This simplifies the funding with fake utxos, since the coin quantities required
       * will only be amounts being transferred (coin outputs) and amounts being forwarded
       * to contract calls.
       */
      transactionRequest.gasPrice = bn(0);
      // Calculate the gasLimit again as we insert a fake UTXO and signer
      transactionRequest.gasLimit = gasLimit.sub(
        transactionRequest.calculateMinGas(chainInfo)
      );

      // Executing dryRun with fake utxos to get gasUsed
      const result = await this.call(transactionRequest, {
        estimateTxDependencies,
      });
      receipts = result.receipts;
      gasUsed = getGasUsedFromReceipts(receipts);
    }
    // Calculate usedFee
    const usedFee = calculatePriceWithFactor(
      max(minGas, gasUsed),
      gasPrice,
      gasPriceFactor
    );
    // Add to required quantities the usedFee on the transaction
    allQuantities = mergeQuantities(allQuantities, [
      {
        assetId: BaseAssetId,
        amount: usedFee,
      },
    ]);

    return {
      requiredQuantities: allQuantities,
      receipts,
      gasUsed,
      minGasPrice,
      gasPrice,
      minGas,
      maxGas,
      usedFee,
      minFee: calculatePriceWithFactor(minGas, gasPrice, gasPriceFactor),
      maxFee: calculatePriceWithFactor(maxGas, gasPrice, gasPriceFactor),
    };
  }
}
