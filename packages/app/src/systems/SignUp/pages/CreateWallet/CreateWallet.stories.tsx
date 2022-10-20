import type { Meta, StoryFn } from '@storybook/react';

import { CreateWallet } from './CreateWallet';

export default {
  component: CreateWallet,
  title: 'SignUp/Pages/2. CreateWallet',
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <CreateWallet />;
