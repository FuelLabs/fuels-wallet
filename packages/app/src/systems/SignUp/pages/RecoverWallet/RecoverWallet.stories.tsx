import type { StoryFn } from '@storybook/react';

import { RecoverWallet } from './RecoverWallet';

export default {
  component: RecoverWallet,
  title: 'SignUp/Pages/3. RecoverWallet',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: StoryFn<unknown> = () => <RecoverWallet />;
