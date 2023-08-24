import { Box } from '@fuel-ui/react';
import { TransactionStatus } from 'fuels';

import {
  MOCK_TRANSACTION_CREATE,
  MOCK_TRANSACTION_SCRIPT,
} from '../../__mocks__/transaction';

import type { TxHeaderProps } from './TxHeader';
import { TxHeader } from './TxHeader';

export default {
  component: TxHeader,
  title: 'Transaction/Components/TxHeader',
};

export const Usage = (args: TxHeaderProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxHeader
      {...args}
      {...MOCK_TRANSACTION_SCRIPT}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
    />
    <TxHeader
      {...args}
      {...MOCK_TRANSACTION_CREATE}
      status={TransactionStatus.success}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
    />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxHeader.Loader />
    <TxHeader.Loader />
  </Box>
);
