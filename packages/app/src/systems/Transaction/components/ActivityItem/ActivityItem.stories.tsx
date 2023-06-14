/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Box } from '@fuel-ui/react';

import { createMockTx } from '../../__mocks__/tx';
import { dateToTai64, OperationName, TxStatus } from '../../utils';

import type { TxItemProps } from './ActivityItem';
import { ActivityItem } from './ActivityItem';

export default {
  component: ActivityItem,
  title: 'Transaction/Components/ActivityItem',
};

const MOCK_TRANSACTION_CONTRACT_CALL_SECONDS_AGO = createMockTx({
  time: dateToTai64(new Date(Date.now() - 1000 * 30)),
  id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6ade8',
  status: TxStatus.pending,
  operation: OperationName.script,
});

const MOCK_TRANSACTION_CONTRACT_CALL_MINUTE_AGO = createMockTx({
  time: dateToTai64(new Date(Date.now() - 1000 * 60 * 24)),
  id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6ade9',
  status: TxStatus.failure,
  operation: OperationName.mint,
});

const MOCK_TRANSACTION_CONTRACT_CALL_HOURS_AGO = createMockTx({
  time: dateToTai64(new Date(Date.now() - 1000 * 60 * 60 * 2)),
  id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6adea',
  status: TxStatus.pending,
  operation: OperationName.receive,
});

const MOCK_TRANSACTION_CONTRACT_CALL_DAYS_AGO = createMockTx({
  time: dateToTai64(new Date(Date.now() - 1000 * 60 * 60 * 24 * 24)),
  id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6adeb',
  status: TxStatus.success,
  operation: OperationName.receive,
});

const MOCK_TRANSACTION_CONTRACT_CALL_MONTHS_AGO = createMockTx({
  time: dateToTai64(new Date(Date.now() - 1000 * 60 * 60 * 24 * 54)),
  id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6adeb',
  status: TxStatus.success,
  operation: OperationName.transfer,
});

const MOCK_TRANSACTION_CONTRACT_CALL_YEARS_AGO = createMockTx({
  time: dateToTai64(new Date(Date.now() - 1000 * 60 * 60 * 24 * 364)),
  id: '0x18617ccc580478214175c4daba11903df93a66a94aada773e80411ed06b6adeb',
  status: TxStatus.success,
  operation: OperationName.contractCreated,
});

const MOCK_TRANSACTION_CONTRACT_CALLS = [
  MOCK_TRANSACTION_CONTRACT_CALL_SECONDS_AGO,
  MOCK_TRANSACTION_CONTRACT_CALL_MINUTE_AGO,
  MOCK_TRANSACTION_CONTRACT_CALL_HOURS_AGO,
  MOCK_TRANSACTION_CONTRACT_CALL_DAYS_AGO,
  MOCK_TRANSACTION_CONTRACT_CALL_MONTHS_AGO,
  MOCK_TRANSACTION_CONTRACT_CALL_YEARS_AGO,
];

const ownerAddress =
  MOCK_TRANSACTION_CONTRACT_CALL_DAYS_AGO.operations[0].from?.address || '';

export const Success = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (tx.status = TxStatus.success));
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$2',
      }}
    >
      {MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (
        <ActivityItem
          key={tx.id}
          {...args}
          transaction={tx}
          ownerAddress={ownerAddress}
        />
      ))}
    </Box>
  );
};

export const Pending = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (tx.status = TxStatus.pending));
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$2',
      }}
    >
      {MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (
        <ActivityItem
          key={tx.id}
          {...args}
          transaction={tx}
          ownerAddress={ownerAddress}
        />
      ))}
    </Box>
  );
};

export const Error = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (tx.status = TxStatus.failure));
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$2',
      }}
    >
      {MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (
        <ActivityItem
          key={tx.id}
          {...args}
          transaction={tx}
          ownerAddress={ownerAddress}
        />
      ))}
    </Box>
  );
};

export const Loader = () => (
  <Box
    css={{ maxWidth: 312, display: 'flex', flexDirection: 'column', gap: '$2' }}
  >
    <ActivityItem.Loader />
    <ActivityItem.Loader />
  </Box>
);
