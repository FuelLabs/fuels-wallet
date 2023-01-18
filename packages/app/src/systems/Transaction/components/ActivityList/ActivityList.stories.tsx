import { Box } from '@fuel-ui/react';
import type { Story } from '@storybook/react';

import { MOCK_TXS } from '../../__mocks__/transactions';

import type { ActivityListProps } from './ActivityList';
import { ActivityList } from './ActivityList';

import { MOCK_ACCOUNTS } from '~/systems/Account';

export default {
  component: ActivityList,
  title: 'Transaction/Components/ActivityList',
};

const Template: Story<ActivityListProps> = (args) => (
  <Box css={{ maxWidth: 320 }}>
    {' '}
    <ActivityList {...args} />{' '}
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  txs: MOCK_TXS,
  ownerAddress: MOCK_ACCOUNTS[3].address,
};

export const Loader = Template.bind({});
Loader.args = {
  txs: [],
  isLoading: true,
  ownerAddress: MOCK_ACCOUNTS[3].address,
};

export const Empty = Template.bind({});
Empty.args = {
  txs: [],
  isLoading: false,
  ownerAddress: MOCK_ACCOUNTS[3].address,
};
