import { Box } from '@fuel-ui/react';
import { bn, Address } from 'fuels';

import { MOCK_TRANSACTION_SCRIPT } from '../../__mocks__/transaction';
import { TxStatus, TxCategory } from '../../types';

import type { TxItemProps } from './ActivityItem';
import { ActivityItem } from './ActivityItem';

export default {
  component: ActivityItem,
  title: 'Transaction/Components/ActivityItem',
};

const MOCK_PROPS: TxItemProps = {
  transaction: MOCK_TRANSACTION_SCRIPT,
  providerUrl: process.env.VITE_FUEL_PROVIDER_URL,
  from: new Address(
    'fuel18ey925p2l79q4sncvmkkk93ygcupjfhfxw9gtq6wuhh58vh2jsusj30acp'
  ),
  to: new Address(
    'fuel18ey925p2l79q4sncvmkkk93ygcupjfhfxw9gtq6wuhh58vh2jsusj30acp'
  ),
  amount: {
    amount: bn(100),
    symbol: 'ETH',
    name: 'Ethereum',
    assetId: '0x000000',
    imageUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  txCategory: TxCategory.PREDICATE,
  txStatus: TxStatus.SUCCESS,
  date: 'Jun 03',
};

export const Success = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem {...args} {...MOCK_PROPS} />
    <ActivityItem {...args} {...MOCK_PROPS} />
  </Box>
);

export const Pending = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem {...args} {...MOCK_PROPS} txStatus={TxStatus.PENDING} />
    <ActivityItem {...args} {...MOCK_PROPS} txStatus={TxStatus.PENDING} />
  </Box>
);

export const Error = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem {...args} {...MOCK_PROPS} txStatus={TxStatus.ERROR} />
    <ActivityItem {...args} {...MOCK_PROPS} txStatus={TxStatus.ERROR} />
  </Box>
);

export const Loader = () => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem.Loader />
    <ActivityItem.Loader />
  </Box>
);
