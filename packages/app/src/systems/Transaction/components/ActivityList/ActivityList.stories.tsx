import type { Story } from '@storybook/react';

import { MOCK_TXS } from '../../__mocks__/transactions';

import type { ActivityListProps } from './ActivityList';
import { ActivityList } from './ActivityList';

import { MOCK_ACCOUNTS } from '~/systems/Account';

export default {
  component: ActivityList,
  title: 'Transaction/Components/ActivityList',
};

export const Usage: Story<ActivityListProps> = (args) => (
  <ActivityList {...args} />
);
Usage.args = {
  transactions: MOCK_TXS,
  ownerAddress: MOCK_ACCOUNTS[3].address,
};
export const Loader = () => (
  <ActivityList
    transactions={[]}
    isLoading={true}
    ownerAddress={MOCK_ACCOUNTS[3].address}
  />
);
export const Empty = () => (
  <ActivityList
    transactions={[]}
    isLoading={false}
    ownerAddress={MOCK_ACCOUNTS[3].address}
  />
);
