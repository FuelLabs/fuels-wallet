import { Box, Button } from '@fuel-ui/react';
import type { Meta, StoryFn } from '@storybook/react';
import { store } from '~/store';
import { Layout } from '~/systems/Core';

import { AccountService, MOCK_ACCOUNTS, useAccounts } from '../..';

import { EditAccount } from './EditAccount';

export default {
  component: EditAccount,
  title: 'Account/Pages/3. EditAccount',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof EditAccount> = () => {
  const { isLoading, handlers } = useAccounts();
  return (
    <Layout isLoading={isLoading}>
      <Box.Centered css={{ minW: '100%', minH: '100%' }}>
        <Button
          onPress={() => handlers.goToEdit(MOCK_ACCOUNTS[0].address)}
          isLoading={isLoading}
        >
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
