import { Box } from '@fuel-ui/react';
import type { StoryFn } from '@storybook/react';
import { MOCK_ACCOUNTS } from '~/systems/Account';

import {
  MOCK_TRANSACTION_CONTRACT_CALL,
  MOCK_TRANSACTION_CONTRACT_CALL_WITH_FUNCTION_PARAMS,
  MOCK_TRANSACTION_CREATE_CONTRACT,
} from '../../__mocks__/tx';

import type { ActivityListProps } from './ActivityList';
import { ActivityList } from './ActivityList';

export default {
  component: ActivityList,
  title: 'Transaction/Components/ActivityList',
};

const MOCK_TXS = [
  MOCK_TRANSACTION_CONTRACT_CALL,
  MOCK_TRANSACTION_CONTRACT_CALL_WITH_FUNCTION_PARAMS,
  MOCK_TRANSACTION_CREATE_CONTRACT,
];

const Template: StoryFn<ActivityListProps> = (args) => (
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
