import { Box } from '@fuel-ui/react';

import { MOCK_TX } from '../../__mocks__/transaction';

import type { TxDetailsProps } from './TxDetails';
import { TxDetails } from './TxDetails';

export default {
  component: TxDetails,
  title: 'Transaction/Components/TxDetails',
};

export const Usage = (args: TxDetailsProps) => (
  <Box css={{ maxWidth: 300 }}>
    <TxDetails {...args} receipts={MOCK_TX.receipts} />
  </Box>
);
