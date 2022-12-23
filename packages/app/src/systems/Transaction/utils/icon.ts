import { Icon } from '@fuel-ui/react';

import { OperationName } from './tx.types';

export const getTxIcon = (type?: OperationName) => {
  switch (type) {
    case OperationName.transfer:
      return Icon.is('UploadSimple');
    case OperationName.receive:
      return Icon.is('DownloadSimple');
    case OperationName.mint:
    case OperationName.predicatecall:
      return Icon.is('MagicWand');
    case OperationName.contractCall:
      return Icon.is('ArrowsLeftRight');
    default:
      return 'ArrowRight';
  }
};
