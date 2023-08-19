import type { Operation } from 'fuels';
import { Address } from 'fuels';

import { OperationDirection } from '../types';

export function getOperationDirection(operation: Operation, owner: string) {
  const operationAddr = operation?.to?.address ?? operation?.from?.address;

  if (!owner?.length || !operationAddr) {
    return OperationDirection.unknown;
  }

  const ownerAddr = Address.fromString(owner);

  return ownerAddr.equals(Address.fromString(operation?.to?.address ?? ''))
    ? OperationDirection.from
    : OperationDirection.to;
}
