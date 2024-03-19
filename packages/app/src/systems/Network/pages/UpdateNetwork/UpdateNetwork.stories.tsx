import { Box, Button } from '@fuel-ui/react';
import type { Meta, StoryFn } from '@storybook/react';
import { Layout } from '~/systems/Core';
import { NetworkService, useNetworks } from '~/systems/Network';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';
import { store } from '~/systems/Store';

import { UpdateNetwork } from './UpdateNetwork';

export default {
  component: UpdateNetwork,
  title: 'Network/Pages/3. UpdateNetwork',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof UpdateNetwork> = () => {
  const { isLoading, handlers, networks } = useNetworks();
  return (
    <Layout isLoading={isLoading}>
      <Box.Centered css={{ minW: '100%', minH: '100%' }}>
        <Button
          onPress={() => handlers.goToUpdate(networks[0].id)}
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
    await NetworkService.clearNetworks();
    await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
    return {};
  },
];
