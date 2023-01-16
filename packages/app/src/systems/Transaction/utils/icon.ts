import type { Icons } from '@fuel-ui/react';

import { OperationName } from './tx.types';

const ICON_MAP = {
  [OperationName.transfer]: 'UploadSimple',
  [OperationName.receive]: 'DownloadSimple',
  [OperationName.mint]: 'ArrowRight',
  [OperationName.predicatecall]: 'MagicWand',
  [OperationName.contractCall]: 'ArrowsLeftRight',
};

export const getTxIcon = (type?: OperationName): Icons => {
  return type ? ICON_MAP[type] ?? 'ArrowRight' : 'ArrowRight';
};
