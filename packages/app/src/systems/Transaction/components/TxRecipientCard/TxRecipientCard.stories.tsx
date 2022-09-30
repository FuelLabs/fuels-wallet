import type { TxRecipientCardProps } from './TxRecipientCard';
import { TxRecipientCard } from './TxRecipientCard';

export default {
  component: TxRecipientCard,
  title: 'Transaction/Components/TxRecipientCard',
};

const ACCOUNT = {
  name: 'Account 1',
  address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef',
  publicKey: '0x00',
};

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
