import { Box } from '@fuel-ui/react';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_CONTRACT_CREATED,
  MOCK_OPERATION_MINT,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';
import { TxStatus } from '../../utils';

import type { TxOperationProps } from './TxOperation';
import { TxOperation } from './TxOperation';

export default {
  component: TxOperation,
  title: 'Transaction/Components/TxOperation',
};

export const ContractCall = (args: TxOperationProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperation
      {...args}
      operation={MOCK_OPERATION_CONTRACT_CALL}
      status={TxStatus.success}
    />
  </Box>
);

export const Transfer = (args: TxOperationProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperation
      {...args}
      operation={MOCK_OPERATION_TRANSFER}
      status={TxStatus.success}
    />
  </Box>
);

export const ContractCreated = (args: TxOperationProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperation
      {...args}
      operation={MOCK_OPERATION_CONTRACT_CREATED}
      status={TxStatus.success}
    />
  </Box>
);

export const Mint = (args: TxOperationProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperation
      {...args}
      operation={MOCK_OPERATION_MINT}
      status={TxStatus.success}
    />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxOperation.Loader />
  </Box>
);
