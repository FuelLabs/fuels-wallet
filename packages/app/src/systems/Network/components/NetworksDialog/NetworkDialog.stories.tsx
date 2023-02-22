import { Box } from '@fuel-ui/react';

import { NetworksDialog } from './NetworksDialog';

export default {
  component: NetworksDialog,
  title: 'Network/Components/NetworksDialog',
};

export const Usage = () => {
  return (
    <Box css={{ width: 200 }}>
      <NetworksDialog />
    </Box>
  );
};
