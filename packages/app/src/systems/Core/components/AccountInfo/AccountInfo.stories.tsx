import { Box } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { AccountInfo } from './AccountInfo';

import { MOCK_ACCOUNTS } from '~/systems/Account';

export default {
  component: AccountInfo,
  title: 'DApp/Components/AccountInfo',
} as Meta;

const Template: ComponentStoryFn<typeof AccountInfo> = (args) => (
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
