import type { Operation } from 'fuels';
import { Address } from 'fuels';

import { safeDynamicAddress } from '~/systems/Core/utils/address';
import { OperationDirection } from '../types';

export function getOperationDirection(operation: Operation, owner: string) {
  const operationAddr = operation?.to?.address ?? operation?.from?.address;

  if (!owner?.length || !operationAddr) {
    return OperationDirection.unknown;
  }

  const ownerAddr = safeDynamicAddress(owner);

  return ownerAddr.equals(safeDynamicAddress(operation?.to?.address ?? ''))
    ? OperationDirection.from
    : OperationDirection.to;
}
