import { BoxCentered, Button } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { AccountService, MOCK_ACCOUNTS, useAccounts } from '../..';

import { Logout } from './Logout';

import { store } from '~/store';
import { Layout } from '~/systems/Core';

export default {
  component: Logout,
  title: 'Account/Pages/3. Logout',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: ComponentStoryFn<typeof Logout> = () => {
  const { isLoading, handlers } = useAccounts();
  return (
    <Layout isLoading={isLoading}>
      <BoxCentered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={handlers.goToLogout} isLoading={isLoading}>
          Toggle Modal
        </Button>
      </BoxCentered>
    </Layout>
  );
};

export const Usage = Template.bind({});
Usage.loaders = [
  async () => {
    store.closeModal();
    await AccountService.clearAccounts();
    await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
    return {};
  },
];
