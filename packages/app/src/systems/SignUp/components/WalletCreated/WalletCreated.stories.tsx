import { Box } from '@fuel-ui/react';
import { MOCK_ACCOUNTS } from '~/systems/Account';

import { WalletCreated } from './WalletCreated';

export default {
  component: WalletCreated,
  title: 'SignUp/Components/WalletCreated',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => (
  <Box.Centered minHS>
    <WalletCreated account={MOCK_ACCOUNTS[0]} />
  </Box.Centered>
);
