import type { Meta, StoryFn } from '@storybook/react';

import { ConfirmWallet } from './ConfirmWallet';

export default {
  component: ConfirmWallet,
  title: 'SignUp/Pages/2. ConfirmWallet',
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <ConfirmWallet />;
