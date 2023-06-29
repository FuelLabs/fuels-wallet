import type { Colors } from '@fuel-ui/css';

import { TxStatus } from './tx.types';

export const getTxStatusColor = (status?: TxStatus): Colors => {
  switch (status) {
    case TxStatus.pending:
      return 'intentsWarning9';
    case TxStatus.success:
      return 'intentsPrimary9';
    case TxStatus.failure:
      return 'intentsError9';
    default:
      return 'intentsBase9';
  }
};

export const getTxIconBgColor = (status: TxStatus | undefined) => {
  switch (status) {
    case TxStatus.success:
      return '$intentsPrimary2';
    case TxStatus.failure:
      return '$intentsError2';
    case TxStatus.pending:
    default:
      return '$intentsWarning2';
  }
};

export const getTxIconColor = (status: TxStatus | undefined) => {
  switch (status) {
    case TxStatus.success:
      return 'intentsPrimary11';
    case TxStatus.failure:
      return 'intentsError8';
    case TxStatus.pending:
    default:
      return 'intentsWarning8';
  }
};
