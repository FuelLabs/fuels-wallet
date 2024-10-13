import type { Bech32Address, Operation, TransactionSummary } from 'fuels';
import { Address, OperationName } from 'fuels';
import { useMemo } from 'react';
import { useAccounts } from '~/systems/Account';

import { OperationDirection } from '../types';
import { formatDate, getOperationDirection } from '../utils';

type UseTxMetadataProps = {
  transaction: TransactionSummary;
  ownerAddress: string;
};

export function getAddress(address?: string) {
  if (!address) return '';
  if (address === 'Network') return address;
  return Address.fromString(address).bech32Address;
}

export function getLabel(operation: Operation, address?: Bech32Address) {
  const { name } = operation;
  const me = address ? Address.fromString(address).toHexString() : '';

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
  const label = getLabel(mainOperation, account?.address as Bech32Address);
  const timeFormattedRaw = time ? formatDate(time) : undefined;
  const timeFormatted = timeFormattedRaw?.replace(
    'a few seconds ago',
    'seconds ago'
  );

  const toOrFromText = useMemo(() => {
    const opDirection = getOperationDirection(mainOperation, ownerAddress);
    switch (opDirection) {
      case OperationDirection.to:
        return 'To: ';
      case OperationDirection.from:
        return 'From: ';
      default:
        return '';
    }
  }, [ownerAddress, mainOperation]);

  const toOrFromAddress = useMemo(() => {
    const opDirection = getOperationDirection(mainOperation, ownerAddress);
    const address =
      opDirection === OperationDirection.to
        ? mainOperation.to?.address
        : mainOperation.from?.address;
    return getAddress(address);
  }, [ownerAddress, mainOperation]);

  return {
    toOrFromAddress,
    toOrFromText,
    label,
    timeFormatted,
    id,
    operation: mainOperation,
    status,
  };
}
