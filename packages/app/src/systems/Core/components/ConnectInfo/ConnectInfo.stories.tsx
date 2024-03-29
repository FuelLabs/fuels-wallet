import { Box } from '@fuel-ui/react';
import type { StoryFn } from '@storybook/react';
import { MOCK_ACCOUNTS } from '~/systems/Account';

import type { ConnectInfoProps } from './ConnectInfo';
import { ConnectInfo } from './ConnectInfo';

export default {
  component: ConnectInfo,
  title: 'DApp/Components/ConnectInfo',
};

const URL = 'fuellabs.github.io/swayswap';

export const Usage: StoryFn<ConnectInfoProps> = (args) => (
  <Box css={{ width: 300 }}>
    <ConnectInfo {...args} origin={URL} />
  </Box>
);

export const Loader: StoryFn<ConnectInfoProps> = () => (
  <Box css={{ width: 300 }}>
    <ConnectInfo.Loader />
  </Box>
);
