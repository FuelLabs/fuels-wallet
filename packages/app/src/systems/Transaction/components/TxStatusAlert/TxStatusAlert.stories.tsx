import { TRANSACTION_ERRORS } from '../../machines';
import { TxStatus } from '../../types';

import type { TxStatusAlertProps } from './TxStatusAlert';
import { TxStatusAlert } from './TxStatusAlert';

export default {
  component: TxStatusAlert,
  title: 'Transaction/Components/TxStatusAlert',
};

export const Failed = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} txStatus={TxStatus.error} txId={'0xoaskokaes'} />
);

export const Pending = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} txStatus={TxStatus.pending} txId={'0xoaskokaes'} />
);

export const InvalidTxId = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} error={TRANSACTION_ERRORS.INVALID_ID} />
);

export const TxNotFound = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} error={TRANSACTION_ERRORS.NOT_FOUND} />
);
