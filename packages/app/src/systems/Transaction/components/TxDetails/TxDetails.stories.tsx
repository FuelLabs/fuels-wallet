import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import type { TxDetailsProps } from './TxDetails';
import { TxDetails } from './TxDetails';

export default {
  component: TxDetails,
  title: 'Transaction/Components/TxDetails',
};

export const Usage = (args: TxDetailsProps) => (
  <Box css={{ maxWidth: 300 }}>
    <TxDetails {...args} fee={bn(10)} />
  </Box>
);
