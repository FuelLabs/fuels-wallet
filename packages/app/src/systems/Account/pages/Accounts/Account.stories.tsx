import type { Meta, StoryFn } from '@storybook/react';

import { Accounts } from './Accounts';

export default {
  component: Accounts,
  title: 'Account/Pages/1. Accounts',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtenstion',
    },
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <Accounts />;
