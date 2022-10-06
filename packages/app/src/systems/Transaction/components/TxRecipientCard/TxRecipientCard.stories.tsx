import type { TxRecipientCardProps } from './TxRecipientCard';
import { TxRecipientCard } from './TxRecipientCard';

import { MOCK_ACCOUNTS } from '~/systems/Account';

export default {
  component: TxRecipientCard,
  title: 'Transaction/Components/TxRecipientCard',
};

const ACCOUNT = MOCK_ACCOUNTS[0];

const CONTRACT = {
  address: '0x239ce1fb790d5b829fe7a40a3d54cb825a403bb3',
};

export const TypeAccount = (args: TxRecipientCardProps) => (
  <TxRecipientCard {...args} account={ACCOUNT} />
);

export const TypeContract = (args: TxRecipientCardProps) => (
  <TxRecipientCard {...args} contract={CONTRACT} />
);

export const Loader = () => {
  return <TxRecipientCard.Loader />;
};
