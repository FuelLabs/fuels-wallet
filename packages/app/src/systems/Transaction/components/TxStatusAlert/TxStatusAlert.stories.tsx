import { TxStatus } from '../../utils';

import type { TxStatusAlertProps } from './TxStatusAlert';
import { TxStatusAlert } from './TxStatusAlert';

export default {
  component: TxStatusAlert,
  title: 'Transaction/Components/TxStatusAlert',
};

export const Failed = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} txStatus={TxStatus.failure} txId={'0xoaskokaes'} />
);

export const Pending = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} txStatus={TxStatus.pending} txId={'0xoaskokaes'} />
);

export const Error = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} error={'Invalid Transaction ID'} />
);
