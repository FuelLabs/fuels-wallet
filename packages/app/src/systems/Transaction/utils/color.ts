import type { Colors } from '@fuel-ui/css';
import { SimplifiedTransactionStatusNameEnum } from 'fuels';

export const getTxStatusColor = (
  status?: SimplifiedTransactionStatusNameEnum
): Colors => {
  switch (status) {
    case SimplifiedTransactionStatusNameEnum.submitted:
      return 'intentsWarning9';
    case SimplifiedTransactionStatusNameEnum.success:
      return 'intentsPrimary9';
    case SimplifiedTransactionStatusNameEnum.failure:
      return 'intentsError9';
    default:
      return 'intentsBase9';
  }
};

export const getTxIconBgColor = (
  status: SimplifiedTransactionStatusNameEnum | undefined
) => {
  switch (status) {
    case SimplifiedTransactionStatusNameEnum.success:
      return '$intentsPrimary2';
    case SimplifiedTransactionStatusNameEnum.failure:
      return '$intentsError2';
    case SimplifiedTransactionStatusNameEnum.submitted:
    default:
      return '$intentsWarning2';
  }
};

export const getTxIconColor = (
  status: SimplifiedTransactionStatusNameEnum | undefined
) => {
  switch (status) {
    case SimplifiedTransactionStatusNameEnum.success:
      return 'intentsPrimary11';
    case SimplifiedTransactionStatusNameEnum.failure:
      return 'intentsError8';
    case SimplifiedTransactionStatusNameEnum.submitted:
    default:
      return 'intentsWarning8';
  }
};
