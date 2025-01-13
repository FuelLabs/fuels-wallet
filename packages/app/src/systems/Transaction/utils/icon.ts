import type { Icons } from '@fuel-ui/react';
import { type B256Address, type Operation, OperationName } from 'fuels';

import { getLabel } from '../hooks/useTxMetadata';

const ICON_MAP = {
  [OperationName.transfer]: 'Upload',
  [OperationName.receive]: 'Download',
  [OperationName.contractCall]: 'ArrowsLeftRight',
} as const;

export const getTxIcon = (
  operation?: Operation,
  address?: B256Address
): Icons => {
  const type: OperationName | undefined = operation?.name;
  const label = operation ? getLabel(operation, address) : 'Unknown';
  if (!type || !ICON_MAP[type as keyof typeof ICON_MAP]) return 'ArrowRight';
  if (label.includes('Sent')) {
    return ICON_MAP[OperationName.transfer] as Icons;
  }
  if (label.includes('Received')) {
    return ICON_MAP[OperationName.receive] as Icons;
  }
  return ICON_MAP[type as keyof typeof ICON_MAP];
};
