/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Box } from '@fuel-ui/react';

import {
  MOCK_TRANSACTION_CONTRACT_CALL,
  MOCK_TRANSACTION_CONTRACT_CALLS,
} from '../../__mocks__/tx';
import { TxStatus } from '../../utils';

import type { TxItemProps } from './ActivityItem';
import { ActivityItem } from './ActivityItem';

export default {
  component: ActivityItem,
  title: 'Transaction/Components/ActivityItem',
};

const ownerAddress =
  MOCK_TRANSACTION_CONTRACT_CALL.tx.operations[0].from?.address || '';

export const Success = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALLS.map(
    (tx) => (tx.tx.status = TxStatus.success)
  );
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      {MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (
        <ActivityItem
          key={tx.tx.id}
          {...args}
          transaction={tx.tx}
          ownerAddress={ownerAddress}
        />
      ))}
    </Box>
  );
};

export const Pending = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALLS.map(
    (tx) => (tx.tx.status = TxStatus.pending)
  );
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      {MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (
        <ActivityItem
          key={tx.tx.id}
          {...args}
          transaction={tx.tx}
          ownerAddress={ownerAddress}
        />
      ))}
    </Box>
  );
};

export const Error = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALLS.map(
    (tx) => (tx.tx.status = TxStatus.failure)
  );
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      {MOCK_TRANSACTION_CONTRACT_CALLS.map((tx) => (
        <ActivityItem
          key={tx.tx.id}
          {...args}
          transaction={tx.tx}
          ownerAddress={ownerAddress}
        />
      ))}
    </Box>
  );
};

export const Loader = () => (
  <Box
    css={{ maxWidth: 312, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem.Loader />
    <ActivityItem.Loader />
  </Box>
);
