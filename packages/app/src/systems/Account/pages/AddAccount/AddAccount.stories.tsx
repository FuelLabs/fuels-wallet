import { Box, Button } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { useAccounts } from '../..';

import { AddAccount } from './AddAccount';

import { store } from '~/store';
import { Layout } from '~/systems/Core';

export default {
  component: AddAccount,
  title: 'Account/Pages/AddAccount',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: ComponentStoryFn<typeof AddAccount> = () => {
  const { isLoading, handlers } = useAccounts();
  return (
    <Layout isLoading={isLoading}>
      <Box.Centered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={handlers.goToAdd} isLoading={isLoading}>
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
    return {};
  },
];
