import { Box } from '@fuel-ui/react';

import { MOCK_TRANSACTION } from '../../__mocks__/transaction';

import type { TxStatusProps } from './TxStatus';
import { TxStatus } from './TxStatus';

export default {
  component: TxStatus,
  title: 'Transaction/Components/TxStatus',
};

export const Usage = (args: TxStatusProps) => (
  <Box css={{ maxWidth: 300 }}>
    <TxStatus {...args} transaction={MOCK_TRANSACTION} />
  </Box>
);

export const Loader = () => (
  <Box css={{ maxWidth: 300 }}>
    <TxStatus.Loader />
  </Box>
);
