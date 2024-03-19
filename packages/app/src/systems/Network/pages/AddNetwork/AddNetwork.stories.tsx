import { Box, Button } from '@fuel-ui/react';
import type { Meta, StoryFn } from '@storybook/react';
import { Layout } from '~/systems/Core';
import { NetworkService, useNetworks } from '~/systems/Network';
import { store } from '~/systems/Store';

import { AddNetwork } from './AddNetwork';

export default {
  component: AddNetwork,
  title: 'Network/Pages/2. AddNetwork',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof AddNetwork> = () => {
  const { isLoading, handlers } = useNetworks();
  return (
    <Layout isLoading={isLoading}>
      <Box.Centered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={handlers.openNetworksAdd} isLoading={isLoading}>
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
    await NetworkService.clearNetworks();
    await NetworkService.addDefaultNetworks();
    return {};
  },
];
