import { Address } from 'fuels';
import { useMemo } from 'react';

import type { Tx } from '../utils';
import {
  formatDate,
  getOperationDirection,
  OperationDirection,
} from '../utils';

type UseTxMetadataProps = {
  transaction: Tx;
  ownerAddress: string;
};

export function useTxMetadata({
  transaction,
  ownerAddress,
}: UseTxMetadataProps) {
  const { operations, time, id = ' ', status } = transaction;

  const mainOperation = operations[0];
  const label = mainOperation.name;

  const timeFormatted = time ? formatDate(time) : undefined;

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
    return address ? Address.fromString(address).bech32Address : '';
  }, [ownerAddress, mainOperation]);

  return {
    toOrFromAddress,
    toOrFromText,
    label,
    timeFormatted,
    id,
    status,
  };
}
