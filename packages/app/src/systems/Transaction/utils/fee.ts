import type { BN } from 'fuels';
import { bn } from 'fuels';

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
        gasPriceFactor.toNumber(),
    ),
  );
}
