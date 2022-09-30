import type { Story } from '@storybook/react';

import { CreateWallet } from './CreateWallet';

export default {
  component: CreateWallet,
  title: 'SignUp/Pages/2. CreateWallet',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: Story<unknown> = () => <CreateWallet />;
