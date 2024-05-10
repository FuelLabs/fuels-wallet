import { Box } from '@fuel-ui/react';
import { bn } from 'fuels';

import type { TxFeeProps } from './TxFee';
import { TxFee } from './TxFee';

export default {
  component: TxFee,
  title: 'Transaction/Components/TxFee',
};

export const Usage = (args: TxFeeProps) => (
  <Box css={{ maxWidth: 300 }}>
    <TxFee {...args} fee={bn(10)} />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFee.Loader />
  </Box>
);
