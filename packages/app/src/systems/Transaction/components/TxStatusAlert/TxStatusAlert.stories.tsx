import { TransactionStatus } from 'fuels';

import type { TxStatusAlertProps } from './TxStatusAlert';
import { TxStatusAlert } from './TxStatusAlert';

export default {
  component: TxStatusAlert,
  title: 'Transaction/Components/TxStatusAlert',
};

export const Failed = (args: TxStatusAlertProps) => (
  <TxStatusAlert
    {...args}
    txStatus={TransactionStatus.failure}
    txId={'0xoaskokaes'}
  />
);

export const Pending = (args: TxStatusAlertProps) => (
  <TxStatusAlert
    {...args}
    txStatus={TransactionStatus.submitted}
    txId={'0xoaskokaes'}
  />
);

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export const Error = (args: TxStatusAlertProps) => (
  <TxStatusAlert {...args} error={'Invalid Transaction ID'} />
);
