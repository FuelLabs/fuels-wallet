import { Box } from '@fuel-ui/react';
import { AssetList } from 'asset-list';
import { SimplifiedTransactionStatusNameEnum } from 'fuels';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_CONTRACT_CREATED,
  MOCK_OPERATION_MINT,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';

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
      status={SimplifiedTransactionStatusNameEnum.success}
      assets={AssetList}
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
      status={SimplifiedTransactionStatusNameEnum.success}
      assets={AssetList}
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
      status={SimplifiedTransactionStatusNameEnum.success}
      assets={AssetList}
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
      status={SimplifiedTransactionStatusNameEnum.success}
      assets={AssetList}
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
