import type { Meta, StoryFn } from '@storybook/react';

import { AddAccount } from './AddAccount';

import { Pages } from '~/systems/Core';

export default {
  component: AddAccount,
  title: 'Account/Pages/2. AddAccount',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
    reactRouter: {
      routePath: Pages.accountAdd(),
    },
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <AddAccount />;
