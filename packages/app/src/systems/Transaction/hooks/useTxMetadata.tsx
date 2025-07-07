import type { Operation } from 'fuels';
import { Address, OperationName } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';

import {
  OperationDirection,
  type TransactionSummaryWithDomain,
} from '../types';
import { formatDate, getOperationDirection } from '../utils';

type UseTxMetadataProps = {
  transaction: TransactionSummaryWithDomain;
  ownerAddress: string;
};

export function getAddress(address?: string) {
  if (!address) return '';
  if (address === 'Network') return address;
  return Address.fromDynamicInput(address).toString();
}

export function getLabel(operation: Operation, address?: string) {
  const { name } = operation;
  const me = address ? Address.fromDynamicInput(address).toString() : '';

  if (name === OperationName.transfer && operation.from?.address === me) {
    return 'Sent asset';
  }
  if (name === OperationName.transfer && operation.to?.address === me) {
    return 'Received asset';
  }
  return name ?? 'Unknown';
}

export function useTxMetadata({
  transaction,
  ownerAddress,
}: UseTxMetadataProps) {
  const { operations, time, id = ' ', status } = transaction;
  const { account } = useAccounts();

  // Avoid screen to break with empty operations
  const mainOperation = operations[0] || {};
  const label = getLabel(mainOperation, account?.address);
  const timeFormattedRaw = time ? formatDate(time) : undefined;
  const timeFormatted = timeFormattedRaw?.replace(
    'a few seconds ago',
    'seconds ago'
  );

  const opDirection = useMemo(
    () => getOperationDirection(mainOperation, ownerAddress),
    [mainOperation, ownerAddress]
  );

  const toOrFromText = useMemo(() => {
    switch (opDirection) {
      case OperationDirection.to:
        return 'To: ';
      case OperationDirection.from:
        return 'From: ';
      default:
        return '';
    }
  }, [opDirection]);

  const toOrFromAddress = useMemo(() => {
    const address =
      opDirection === OperationDirection.to
        ? mainOperation.to?.address
        : mainOperation.from?.address;
    return getAddress(address);
  }, [opDirection, mainOperation]);

  const toDomain = useMemo(() => mainOperation.to?.domain, [mainOperation]);

  return {
    toOrFromAddress,
    toOrFromText,
    label,
    timeFormatted,
    id,
    operation: mainOperation,
    status,
    toDomain,
  };
}
