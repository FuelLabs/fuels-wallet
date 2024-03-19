import { Box, Button } from '@fuel-ui/react';
import type { Meta, StoryFn } from '@storybook/react';
import { store } from '~/store';
import { Layout } from '~/systems/Core';

import { useAccounts } from '../..';

import { ImportAccount } from './ImportAccount';

export default {
  component: ImportAccount,
  title: 'Account/Pages/ImportAccount',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof ImportAccount> = () => {
  const { isLoading, handlers } = useAccounts();
  return (
    <Layout isLoading={isLoading}>
      <Box.Centered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={handlers.goToImport} isLoading={isLoading}>
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
