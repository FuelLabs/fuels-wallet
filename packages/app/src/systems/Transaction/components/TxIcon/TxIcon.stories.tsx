import { Box } from '@fuel-ui/react';

import {
  MOCK_TRANSACTION_CREATE,
  MOCK_TRANSACTION_SCRIPT,
} from '../../__mocks__/transaction';
import { TxStatus } from '../../types';

import type { TxIconProps } from './TxIcon';
import { TxIcon } from './TxIcon';

export default {
  component: TxIcon,
  title: 'Transaction/Components/TxIcon',
};

export const Usage = (args: TxIconProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxIcon
      {...args}
      transaction={MOCK_TRANSACTION_SCRIPT}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
    />
    <TxIcon
      {...args}
      transaction={{ ...MOCK_TRANSACTION_CREATE, status: TxStatus.success }}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
    />
    <TxIcon
      {...args}
      transaction={{ ...MOCK_TRANSACTION_CREATE, status: TxStatus.error }}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
    />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxIcon.Loader />
    <TxIcon.Loader />
  </Box>
);
