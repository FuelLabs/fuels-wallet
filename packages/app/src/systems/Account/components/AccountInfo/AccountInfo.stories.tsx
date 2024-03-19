import { Box } from '@fuel-ui/react';
import type { Meta, StoryFn } from '@storybook/react';
import { MOCK_ACCOUNTS } from '~/systems/Account';

import { AccountInfo } from './AccountInfo';

export default {
  component: AccountInfo,
  title: 'DApp/Components/AccountInfo',
} as Meta;

const Template: StoryFn<typeof AccountInfo> = (args) => (
  <Box css={{ width: '300px' }}>
    <AccountInfo {...args} />
  </Box>
);

export const Usage = Template.bind({});
Usage.args = {
  headerText: 'Signer Account:',
  account: MOCK_ACCOUNTS[0],
};

export const Loader = Template.bind({});
Loader.args = {};
