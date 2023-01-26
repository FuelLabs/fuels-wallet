import { Box } from '@fuel-ui/react';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import type { AccountItemProps } from './AccountItem';
import { AccountItem } from './AccountItem';

export default {
  component: AccountItem,
  title: 'Account/Components/AccountItem',
};

export const Usage = (args: AccountItemProps) => (
  <Box css={{ width: 320 }}>
    <AccountItem {...args} account={MOCK_ACCOUNTS[0]} />
  </Box>
);

export const Compact = (args: AccountItemProps) => (
  <Box css={{ width: 320 }}>
    <AccountItem {...args} account={MOCK_ACCOUNTS[0]} compact />
  </Box>
);

export const Current = (args: AccountItemProps) => (
  <Box css={{ width: 320 }}>
    <AccountItem {...args} account={MOCK_ACCOUNTS[0]} isCurrent />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 320 }}>
    <AccountItem.Loader />
  </Box>
);
