import { Icon } from '@fuel-ui/react';

import { TxCategory } from '../types';

export const getTxIcon = (type?: TxCategory) => {
  switch (type) {
    case TxCategory.SEND:
      return Icon.is('UploadSimple');
    case TxCategory.RECEIVE:
      return Icon.is('DownloadSimple');
    case TxCategory.SCRIPT:
    case TxCategory.PREDICATE:
      return Icon.is('MagicWand');
    case TxCategory.CONTRACTCALL:
      return Icon.is('ArrowsLeftRight');
    default:
      return 'ArrowRight';
  }
};
