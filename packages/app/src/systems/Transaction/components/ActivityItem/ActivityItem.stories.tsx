import { Box } from '@fuel-ui/react';

import type { TxItemProps } from './ActivityItem';
import { ActivityItem } from './ActivityItem';
import { MOCK_TRANSACTION } from './__mocks__/transaction';

export default {
  component: ActivityItem,
  title: 'Transaction/Components/ActivityItem',
};

const MOCK_PROPS: TxItemProps = {
  transaction: MOCK_TRANSACTION,
  providerUrl: process.env.VITE_FUEL_PROVIDER_URL,
};

export const Success = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem {...args} {...MOCK_PROPS} />
    <ActivityItem {...args} {...MOCK_PROPS} />
  </Box>
);

export const Pending = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem {...args} {...MOCK_PROPS} />
    <ActivityItem {...args} {...MOCK_PROPS} />
  </Box>
);

export const Error = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem {...args} {...MOCK_PROPS} />
    <ActivityItem {...args} {...MOCK_PROPS} />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem.Loader />
    <ActivityItem.Loader />
  </Box>
);
