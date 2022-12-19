import { Box } from '@fuel-ui/react';
import { bn, Address } from 'fuels';

import { MOCK_TRANSACTION_SCRIPT } from '../../__mocks__/transaction';
import { TxStatus, TxType } from '../../types';

import type { TxItemProps } from './ActivityItem';
import { ActivityItem } from './ActivityItem';

export default {
  component: ActivityItem,
  title: 'Transaction/Components/ActivityItem',
};

export const Usage = (args: TxItemProps) => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <ActivityItem
      {...args}
      transaction={MOCK_TRANSACTION_SCRIPT}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
      asset="ETH"
      amount={bn(100000000)}
      from={
        new Address(
          'fuel18ey925p2l79q4sncvmkkk93ygcupjfhfxw9gtq6wuhh58vh2jsusj30acp'
        )
      }
      txType={TxType.SEND}
      date={'Jun 27'}
      txStatus={TxStatus.success}
    />
    <ActivityItem
      {...args}
      transaction={MOCK_TRANSACTION_SCRIPT}
      providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
      asset="ETH"
      amount={bn(2000000000)}
      from={
        new Address(
          'fuel18ey925p2l79q4sncvmkkk93ygcupjfhfxw9gtq6wuhh58vh2jsusj30acp'
        )
      }
      txType={TxType.SEND}
      date={'July 27'}
      txStatus={TxStatus.pending}
    />
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
