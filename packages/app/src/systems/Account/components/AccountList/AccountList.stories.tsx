import { Box } from '@fuel-ui/react';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import type { AccountListProps } from './AccountList';
import { AccountList } from './AccountList';

export default {
  component: AccountList,
  title: 'Account/Components/AccountList',
};

export const Usage = (args: AccountListProps) => (
  <Box css={{ width: 320 }}>
    <AccountList {...args} accounts={MOCK_ACCOUNTS} />
  </Box>
);
