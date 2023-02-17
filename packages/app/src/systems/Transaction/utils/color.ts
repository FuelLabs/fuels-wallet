import type { Colors } from '@fuel-ui/css';

import { TxStatus } from './tx.types';

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

export const getTxIconBgColor = (status: TxStatus | undefined) => {
  switch (status) {
    case TxStatus.success:
      return '$mint2';
    case TxStatus.failure:
      return '$crimson2';
    case TxStatus.pending:
    default:
      return '$amber2';
  }
};

export const getTxIconColor = (status: TxStatus | undefined) => {
  switch (status) {
    case TxStatus.success:
      return 'green11';
    case TxStatus.failure:
      return 'crimson8';
    case TxStatus.pending:
    default:
      return 'amber8';
  }
};
