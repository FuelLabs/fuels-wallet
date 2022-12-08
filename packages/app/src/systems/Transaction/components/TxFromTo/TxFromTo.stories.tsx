import { Box } from '@fuel-ui/react';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';
import { TxStatus } from '../../types';

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
      status={TxStatus.pending}
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
      status={TxStatus.success}
    />
  </Box>
);
export const Failed = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} status={TxStatus.error} />
  </Box>
);

export const Loading = (args: TxFromToProps) => (
  <Box
    css={{ maxWidth: 318, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} isLoading />
  </Box>
);
