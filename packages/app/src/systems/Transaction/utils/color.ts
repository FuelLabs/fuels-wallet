import type { Colors } from '@fuel-ui/css';

import { TxStatus } from '.';

export const getTxStatusColor = (status?: TxStatus): Colors => {
  switch (status) {
    case TxStatus.pending:
      return 'amber9';
    case TxStatus.success:
      return 'mint9';
    case TxStatus.failure:
      return 'crimson9';
    default:
      return 'gray9';
  }
};
