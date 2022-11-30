import type { Colors } from '@fuel-ui/css';
import { TransactionType } from 'fuels';

import { TxStatus } from '../types';

export const getTxStatusText = (status?: TxStatus) => {
  switch (status) {
    case TxStatus.pending:
      return 'Pending';
    case TxStatus.success:
      return 'Success';
    case TxStatus.error:
      return 'Error';
    default:
      return 'Unknown';
  }
};

export const getTxStatusColor = (status?: TxStatus): Colors => {
  switch (status) {
    case TxStatus.pending:
      return 'amber9';
    case TxStatus.success:
      return 'mint9';
    case TxStatus.error:
      return 'crimson9';
    default:
      return 'gray9';
  }
};

export const getTransactionTypeText = (type: TransactionType) => {
  switch (type) {
    case TransactionType.Script:
      return 'Script';
    case TransactionType.Create:
      return 'Create';
    case TransactionType.Mint:
      return 'Mint';
    default:
      return '';
  }
};
