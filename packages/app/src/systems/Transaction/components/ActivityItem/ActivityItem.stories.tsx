import { Box } from '@fuel-ui/react';

import { MOCK_TRANSACTION_CONTRACT_CALL } from '../../__mocks__/tx';
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
  MOCK_TRANSACTION_CONTRACT_CALL.tx.status = TxStatus.success;
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      <ActivityItem
        {...args}
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
      <ActivityItem
        {...args}
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
    </Box>
  );
};

export const Pending = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALL.tx.status = TxStatus.pending;
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      <ActivityItem
        {...args}
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
      <ActivityItem
        {...args}
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
    </Box>
  );
};

export const Error = (args: TxItemProps) => {
  MOCK_TRANSACTION_CONTRACT_CALL.tx.status = TxStatus.failure;
  return (
    <Box
      css={{
        maxWidth: 312,
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      <ActivityItem
        {...args}
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
      <ActivityItem
        {...args}
        transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx}
        ownerAddress={ownerAddress}
      />
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
