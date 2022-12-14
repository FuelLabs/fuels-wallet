import { Box } from '@fuel-ui/react';

import { MOCK_OPERATION } from '../../__mocks__/operation';
import { Status } from '../../utils';

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
      operations={[MOCK_OPERATION, MOCK_OPERATION]}
      status={Status.success}
    />
  </Box>
);
