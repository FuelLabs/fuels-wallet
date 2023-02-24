import { BoxCentered, Button } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { AddNetwork } from './AddNetwork';

import { Layout } from '~/systems/Core';
import { NetworkService, useNetworks } from '~/systems/Network';
import { store } from '~/systems/Store';

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

const Template: ComponentStoryFn<typeof AddNetwork> = () => {
  const { isLoading, handlers } = useNetworks();
  return (
    <Layout isLoading={isLoading}>
      <BoxCentered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={handlers.openNetworksAdd} isLoading={isLoading}>
          Toggle Modal
        </Button>
      </BoxCentered>
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
