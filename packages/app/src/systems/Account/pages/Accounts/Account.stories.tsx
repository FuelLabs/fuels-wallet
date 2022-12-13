import type { Meta, StoryFn } from '@storybook/react';

import { AccountService, MOCK_ACCOUNTS } from '../..';

import { Accounts } from './Accounts';

export default {
  component: Accounts,
  title: 'Account/Pages/1. Accounts',
  loaders: [
    async () => {
      await AccountService.clearAccounts();
      await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
      await AccountService.addAccount({ data: MOCK_ACCOUNTS[1] });
      return {};
    },
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtenstion',
    },
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <Accounts />;
