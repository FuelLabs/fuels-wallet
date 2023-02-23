import { Box } from '@fuel-ui/react';
import type { StoryFn } from '@storybook/react';

import type { AccountInfoProps } from './AccountInfo';
import { AccountInfo } from './AccountInfo';

import { MOCK_ACCOUNTS } from '~/systems/Account';

export default {
  component: AccountInfo,
  title: 'DApp/Components/AccountInfo',
};

export const Usage: StoryFn<AccountInfoProps> = (args) => (
  <Box css={{ width: 300 }}>
    <AccountInfo
      {...args}
      headerText={'Signer Account'}
      account={MOCK_ACCOUNTS[0]}
    />
  </Box>
);

export const Loader: StoryFn<AccountInfoProps> = () => (
  <Box css={{ width: 300 }}>
    <AccountInfo.Loader />
  </Box>
);
