import type { Icons } from '@fuel-ui/react';
import { type Bech32Address, type Operation, OperationName } from 'fuels';

import { getLabel } from '../hooks/useTxMetadata';

const ICON_MAP = {
  [OperationName.transfer]: 'Upload',
  [OperationName.receive]: 'Download',
  [OperationName.sent]: 'Upload',
  [OperationName.mint]: 'ArrowRight',
  [OperationName.predicatecall]: 'Wand',
  [OperationName.contractCall]: 'ArrowsLeftRight',
};

export const getTxIcon = (
  operation?: Operation,
  address?: Bech32Address
): Icons => {
  const type = operation?.name;
  const label = operation ? getLabel(operation, address) : 'Unknown';
  if (!type || !ICON_MAP[type]) return 'ArrowRight';
  if (label.includes('Sent')) {
    return ICON_MAP[OperationName.sent] as Icons;
  }
  if (label.includes('Received')) {
    return ICON_MAP[OperationName.receive] as Icons;
  }
  return ICON_MAP[type];
};
