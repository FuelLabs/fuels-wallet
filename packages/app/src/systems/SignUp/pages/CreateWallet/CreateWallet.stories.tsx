import type { Meta, Story } from '@storybook/react';

import { CreateWallet } from './CreateWallet';

export default {
  component: CreateWallet,
  title: 'SignUp/Pages/2. CreateWallet',
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Usage: Story<unknown> = () => <CreateWallet />;
