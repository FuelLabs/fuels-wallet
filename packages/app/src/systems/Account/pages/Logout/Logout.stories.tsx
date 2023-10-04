import { Box, Button } from '@fuel-ui/react';
import type { StoryFn, Meta } from '@storybook/react';
import { store } from '~/store';
import { Layout } from '~/systems/Core';

import { AccountService, MOCK_ACCOUNTS, useAccounts } from '../..';

import { Logout } from './Logout';

export default {
  component: Logout,
  title: 'Account/Pages/Logout',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof Logout> = () => {
  const { isLoading, handlers } = useAccounts();
  return (
    <Layout isLoading={isLoading}>
      <Box.Centered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={handlers.logout} isLoading={isLoading}>
          Toggle Modal
        </Button>
      </Box.Centered>
    </Layout>
  );
};

export const Usage = Template.bind({});
Usage.loaders = [
  async () => {
    store.closeOverlay();
    await AccountService.clearAccounts();
    await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
    return {};
  },
];
