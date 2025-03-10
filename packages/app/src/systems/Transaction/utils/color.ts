import type { Colors } from '@fuel-ui/css';
import { TransactionStatus } from 'fuels';

export const getTxStatusColor = (status?: TransactionStatus): Colors => {
  switch (status) {
    case TransactionStatus.submitted:
      return 'intentsWarning7';
    case TransactionStatus.success:
      return 'intentsPrimary11';
    case TransactionStatus.failure:
      return 'intentsError7';
    default:
      return 'intentsBase7';
  }
};

export const getTxIconBgColor = (status: TransactionStatus | undefined) => {
  switch (status) {
    case TransactionStatus.success:
      return '$intentsPrimary2';
    case TransactionStatus.failure:
      return '$intentsError2';
    default:
      return '$intentsWarning2';
  }
};

export const getTxIconColor = (status: TransactionStatus | undefined) => {
  switch (status) {
    case TransactionStatus.success:
      return 'intentsPrimary11';
    case TransactionStatus.failure:
      return 'intentsError8';
    default:
      return 'intentsWarning8';
  }
};
