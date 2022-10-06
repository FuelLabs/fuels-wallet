import { Box } from '@fuel-ui/react';
import type { Story } from '@storybook/react';

import type { ConnectInfoProps } from './ConnectInfo';
import { ConnectInfo } from './ConnectInfo';

export default {
  component: ConnectInfo,
  title: 'DApp/Components/ConnectInfo',
};

const URL = 'https://fuellabs.github.io/swayswap/';
const ACCOUNT = {
  name: 'Account 1',
  address: 'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
  publicKey: '0x00',
};

export const Usage: Story<ConnectInfoProps> = (args) => (
  <Box css={{ width: 300 }}>
    <ConnectInfo {...args} url={URL} account={ACCOUNT} />
  </Box>
);
