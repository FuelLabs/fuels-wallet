import { Box } from '@fuel-ui/react';

import { WalletActions } from './WalletActions';

export default {
  component: WalletActions,
  title: 'Home/Components/WalletActions',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <WalletActions />
  </Box>
);

export const Disabled = () => (
  <Box css={{ width: 300 }}>
    <WalletActions isDisabled />
  </Box>
);
