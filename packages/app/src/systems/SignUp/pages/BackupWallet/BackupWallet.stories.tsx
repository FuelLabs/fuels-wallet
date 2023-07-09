import type { Meta, StoryFn } from '@storybook/react';

import { BackupWallet } from './BackupWallet';

export default {
  component: BackupWallet,
  title: 'SignUp/Pages/2. BackupWallet',
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <BackupWallet />;
