import { Box } from '@fuel-ui/react';
import { TransactionStatus } from 'fuels';

import {
  MOCK_FUEL_ASSETS,
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';

import type { TxOperationsProps } from './TxOperations';
import { TxOperations } from './TxOperations';

export default {
  component: TxOperations,
  title: 'Transaction/Components/TxOperations',
};

export const Default = (args: TxOperationsProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperations
      {...args}
      operations={[MOCK_OPERATION_CONTRACT_CALL, MOCK_OPERATION_TRANSFER]}
      status={TransactionStatus.success}
      assets={MOCK_FUEL_ASSETS}
    />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperations.Loader />
  </Box>
);
