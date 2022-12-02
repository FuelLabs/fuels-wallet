import { Box } from '@fuel-ui/react';

import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';

import type { TxRecipientCardProps } from './TxRecipientCard';
import { TxRecipientCard } from './TxRecipientCard';

export default {
  component: TxRecipientCard,
  title: 'Transaction/Components/TxRecipientCard',
};

const { account: ACCOUNT, contract: CONTRACT } = MOCK_TX_RECIPIENT;

export const TypeAccount = (args: TxRecipientCardProps) => (
  <Box
    css={{ maxWidth: 151, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxRecipientCard {...args} recipient={ACCOUNT} />
  </Box>
);

export const TypeContract = (args: TxRecipientCardProps) => (
  <Box
    css={{ maxWidth: 151, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxRecipientCard {...args} recipient={CONTRACT} />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 151, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxRecipientCard.Loader />
  </Box>
);
