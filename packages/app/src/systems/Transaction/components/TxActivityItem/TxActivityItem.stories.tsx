import { Box } from '@fuel-ui/react';

import {
  MOCK_TRANSACTION_CREATE,
  MOCK_TRANSACTION_SCRIPT,
} from '../../__mocks__/transaction';
import { TxStatus } from '../../types';

import type { TxItemProps } from './TxActivityItem';
import { TxItem } from './TxActivityItem';

export default {
  component: TxItem,
  title: 'Transaction/Components/TxItem',
};

export const Usage = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxItem
      {...args}
      transaction={MOCK_TRANSACTION_SCRIPT}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
    />
    <TxItem
      {...args}
      transaction={{ ...MOCK_TRANSACTION_CREATE, status: TxStatus.success }}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
    />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxItem.Loader />
    <TxItem.Loader />
  </Box>
);
