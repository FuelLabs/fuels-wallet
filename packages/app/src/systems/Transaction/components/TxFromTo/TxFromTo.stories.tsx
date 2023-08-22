import { Box } from '@fuel-ui/react';
import { OperationName, SimplifiedTransactionStatusNameEnum } from 'fuels';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';

import type { TxFromToProps } from './TxFromTo';
import { TxFromTo } from './TxFromTo';

export default {
  component: TxFromTo,
  title: 'Transaction/Components/TxFromTo',
};

const { account: ACCOUNT, contract: CONTRACT } = MOCK_TX_RECIPIENT;

export const Default = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} />
  </Box>
);
export const ExecuteContract = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo
      {...args}
      from={ACCOUNT}
      to={CONTRACT}
      operationName={OperationName.contractCall}
    />
  </Box>
);
export const OnlyTo = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo {...args} to={CONTRACT} />
  </Box>
);
export const Pending = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo
      {...args}
      from={ACCOUNT}
      to={CONTRACT}
      status={SimplifiedTransactionStatusNameEnum.submitted}
    />
  </Box>
);
export const Success = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo
      {...args}
      from={ACCOUNT}
      to={CONTRACT}
      status={SimplifiedTransactionStatusNameEnum.success}
    />
  </Box>
);
export const Failed = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo
      {...args}
      from={ACCOUNT}
      to={CONTRACT}
      status={SimplifiedTransactionStatusNameEnum.failure}
    />
  </Box>
);

export const Loading = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} isLoading />
  </Box>
);
