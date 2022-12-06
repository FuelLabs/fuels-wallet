import type { Colors } from '@fuel-ui/css';
import { isBech32, TransactionType } from 'fuels';

import { TxStatus } from '../types';

export const getTxStatus = (status: string = '') => {
  switch (status) {
    case 'FailureStatus':
      return TxStatus.error;
    case 'SuccessStatus':
      return TxStatus.success;
    case 'SubmittedStatus':
      return TxStatus.pending;
    default:
      return undefined;
  }
};

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

export const isValidTxId = (txId: string = '') => {
  return isBech32(txId) || isB256(txId);
};

// TODO: should be removed when https://github.com/FuelLabs/fuels-ts/issues/626 gets closed/merged/released
export const isB256 = (val: string) => {
  return /(0x)?[0-9a-f]{64}$/i.test(val);
};
