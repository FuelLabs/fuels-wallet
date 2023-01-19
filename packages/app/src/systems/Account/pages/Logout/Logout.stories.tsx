import type { Meta, StoryFn } from '@storybook/react';

import { AccountService, MOCK_ACCOUNTS } from '../..';

import { Logout } from './Logout';

import { store } from '~/store';

export default {
  component: Logout,
  title: 'Account/Pages/3. Logout',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <Logout />;
Usage.loaders = [
  async () => {
    await AccountService.clearAccounts();
    await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
    await AccountService.addAccount({ data: MOCK_ACCOUNTS[1] });
    store.reset();
    return {};
  },
];
