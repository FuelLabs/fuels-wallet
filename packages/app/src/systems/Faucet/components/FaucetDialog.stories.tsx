import { Box } from '@fuel-ui/react';

import { FaucetDialog } from './FaucetDialog';

export default {
  component: FaucetDialog,
  title: 'Faucet/Components/FaucetDialog',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <FaucetDialog />
  </Box>
);
