import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import type { AccountWithBalance } from '@fuel-wallet/types';
import type { BalanceWidgetProps } from './BalanceWidget';
import { BalanceWidget } from './BalanceWidget';

export default {
  component: BalanceWidget,
  title: 'Account/Components/BalanceWidget',
};

const ACCOUNT: AccountWithBalance = {
  ...MOCK_ACCOUNTS[0],
  balance: bn(12008943834),
  balanceSymbol: '$',
  balances: [],
};

export const Usage = (args: BalanceWidgetProps) => (
  <Box css={{ width: 320 }}>
    <BalanceWidget {...args} account={ACCOUNT} />
  </Box>
);

export const Hidden = (args: BalanceWidgetProps) => (
  <Box css={{ width: 320 }}>
    <BalanceWidget {...args} account={ACCOUNT} />
  </Box>
);

Hidden.args = {
  visibility: false,
};

export const Loader = () => (
  <Box css={{ width: 320 }}>
    <BalanceWidget />
  </Box>
);
