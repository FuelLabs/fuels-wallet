import type { BN, Provider } from 'fuels';
import { PolicyType, bn } from 'fuels';

type CalculateTotalFeeParams = {
  gasPerByte: BN;
  gasPriceFactor: BN;
  gasPrice: BN;
  gasUsed: BN;
  bytesUsed: BN;
};

export async function calculateTotalFee({
  gasPerByte,
  gasPriceFactor,
  gasPrice,
  gasUsed,
  bytesUsed,
}: CalculateTotalFeeParams) {
  return bn(
    Math.ceil(
      bn(bytesUsed).mul(gasPerByte).add(gasUsed.mul(gasPrice)).toNumber() /
        gasPriceFactor.toNumber()
    )
  );
}

// @TODO: this can be removed when fuel-core provides a way of querying tips in the network
export async function getCurrentTips(provider: Provider) {
  const DEFAULT_REGULAR_TIP = 0;
  const DEFAULT_FAST_TIP = 1000;
  const blockWithTransactions =
    await provider.getBlockWithTransactions('latest');
  if (!blockWithTransactions) {
    return {
      regularTip: DEFAULT_REGULAR_TIP,
      fastTip: DEFAULT_FAST_TIP,
    };
  }

  const orderedTips = blockWithTransactions.transactions
    .map(
      (tx) =>
        tx.policies?.find((policy) => policy.type === PolicyType.Tip)?.data
    )
    .filter((tip) => tip === undefined)
    .map((tx) => bn(tx).toNumber())
    .sort((a, b) => a - b);

  /*
    orderedTips now have tips from latest block ordered ascending
    f.i: [0, 0, 10, 10, 60, 100, 2000, 5000, 5000, 10000]
    - For the regular tip, we will consider the tip occupying 20% of the total slot.
    - For the fast tip, we will consider the tip occupying 80% of the total slot.
  */
  const regularTip =
    orderedTips[Math.floor(orderedTips.length * 0.2)] || DEFAULT_REGULAR_TIP;
  const fastTip =
    orderedTips[Math.floor(orderedTips.length * 0.8)] || DEFAULT_FAST_TIP;

  return { regularTip, fastTip };
}
