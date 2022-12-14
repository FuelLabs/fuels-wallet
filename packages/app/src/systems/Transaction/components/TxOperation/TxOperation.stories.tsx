import { Box } from '@fuel-ui/react';

import { MOCK_OPERATION } from '../../__mocks__/operation';
import { Status } from '../../utils';

import type { TxOperationProps } from './TxOperation';
import { TxOperation } from './TxOperation';

export default {
  component: TxOperation,
  title: 'Transaction/Components/TxOperation',
};

export const Default = (args: TxOperationProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperation {...args} operation={MOCK_OPERATION} status={Status.success} />
  </Box>
);
