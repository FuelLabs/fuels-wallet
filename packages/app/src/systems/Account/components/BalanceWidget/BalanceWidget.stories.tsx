import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import type { BalanceWidgetProps } from './BalanceWidget';
import { BalanceWidget } from './BalanceWidget';

export default {
  component: BalanceWidget,
  title: 'Account/Components/BalanceWidget',
};

const ACCOUNT = {
  ...MOCK_ACCOUNTS[0],
  balance: bn(12008943834),
  balanceSymbol: '$',
};

export const Usage = (args: BalanceWidgetProps) => (
  <Box css={{ width: 320 }}>
    <BalanceWidget {...args} account={ACCOUNT} />
  </Box>
);

export const Hidden = (args: BalanceWidgetProps) => (
  <Box css={{ width: 320 }}>
    <BalanceWidget {...args} account={ACCOUNT} isHidden />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 320 }}>
    <BalanceWidget.Loader />
  </Box>
);
