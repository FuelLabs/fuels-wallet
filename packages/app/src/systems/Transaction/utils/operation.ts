import { Address } from 'fuels';

import type { Operation } from './tx';
import { OperationDirection } from './tx';

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
