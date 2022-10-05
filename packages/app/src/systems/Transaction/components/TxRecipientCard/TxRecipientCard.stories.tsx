import type { TxRecipientCardProps } from './TxRecipientCard';
import { TxRecipientCard } from './TxRecipientCard';

export default {
  component: TxRecipientCard,
  title: 'Transaction/Components/TxRecipientCard',
};

const ACCOUNT = {
  name: 'Account 1',
  address: 'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
  publicKey: '0x00',
};

const CONTRACT = {
  address: '0x277fe98efbafc2ee0a533e41104bf0b163ad35c180c2da4e1403ea5445f6207c',
};

export const TypeAccount = (args: TxRecipientCardProps) => (
  <TxRecipientCard {...args} address={ACCOUNT.address} />
);

export const TypeContract = (args: TxRecipientCardProps) => (
  <TxRecipientCard {...args} address={CONTRACT.address} />
);

export const Loader = () => {
  return <TxRecipientCard.Loader />;
};
