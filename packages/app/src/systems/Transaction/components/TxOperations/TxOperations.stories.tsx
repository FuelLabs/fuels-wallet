import { Box } from '@fuel-ui/react';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';
import { TxStatus } from '../../utils';

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
      status={TxStatus.success}
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
