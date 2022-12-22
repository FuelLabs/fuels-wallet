import type { Colors } from '@fuel-ui/css';
import { Icon } from '@fuel-ui/react';
import { TransactionType } from 'fuels';

import { TxStatus, TxCategory } from '../types';

export const getTxStatus = (status: string = '') => {
  switch (status) {
    case 'FailureStatus':
      return TxStatus.ERROR;
    case 'SuccessStatus':
      return TxStatus.SUCCESS;
    case 'SubmittedStatus':
      return TxStatus.PENDING;
    default:
      return undefined;
  }
};

export const getTxStatusText = (status?: TxStatus) => {
  switch (status) {
    case TxStatus.PENDING:
      return 'Pending';
    case TxStatus.SUCCESS:
      return 'Success';
    case TxStatus.ERROR:
      return 'Error';
    default:
      return 'Unknown';
  }
};

export const getTxStatusColor = (status?: TxStatus): Colors => {
  switch (status) {
    case TxStatus.PENDING:
      return 'amber9';
    case TxStatus.SUCCESS:
      return 'mint9';
    case TxStatus.ERROR:
      return 'crimson9';
    default:
      return 'gray9';
  }
};

export const getTransactionTypeText = (type?: TransactionType) => {
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

// TODO: should be removed when https://github.com/FuelLabs/fuels-ts/issues/626 gets closed/merged/released
export const isB256 = (val?: string) => {
  return val && /(0x)?[0-9a-f]{64}$/i.test(val);
};
