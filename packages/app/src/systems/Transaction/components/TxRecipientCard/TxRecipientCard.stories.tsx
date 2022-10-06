import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';

import type { TxRecipientCardProps } from './TxRecipientCard';
import { TxRecipientCard } from './TxRecipientCard';

export default {
  component: TxRecipientCard,
  title: 'Transaction/Components/TxRecipientCard',
};

const { account: ACCOUNT, contract: CONTRACT } = MOCK_TX_RECIPIENT;

export const TypeAccount = (args: TxRecipientCardProps) => (
  <TxRecipientCard {...args} recipient={ACCOUNT} />
);

export const TypeContract = (args: TxRecipientCardProps) => (
  <TxRecipientCard {...args} recipient={CONTRACT} />
);

export const Loader = () => {
  return <TxRecipientCard.Loader />;
};
