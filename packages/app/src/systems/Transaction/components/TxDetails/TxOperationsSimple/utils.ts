import type { ContractCallMetadata, SwapMetadata } from '../../../types';

export function isSwapMetadata(
  metadata: ContractCallMetadata | SwapMetadata | undefined
): metadata is SwapMetadata {
  return (
    metadata !== undefined && 'isSwap' in metadata && metadata.isSwap === true
  );
}

export function isContractCallMetadata(
  metadata: ContractCallMetadata | SwapMetadata | undefined
): metadata is ContractCallMetadata {
  return metadata !== undefined && 'operationCount' in metadata;
}
