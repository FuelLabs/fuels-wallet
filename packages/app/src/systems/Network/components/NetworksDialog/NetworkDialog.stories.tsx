import { BoxCentered, Button } from '@fuel-ui/react';
import type { ComponentStoryFn, Meta } from '@storybook/react';

import { NetworksDialog } from './NetworksDialog';

import { Layout } from '~/systems/Core';
import { NetworkService, useNetworks } from '~/systems/Network';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';
import { store } from '~/systems/Store';

export default {
  component: NetworksDialog,
  title: 'Network/Components/NetworksDialog',
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: ComponentStoryFn<typeof NetworksDialog> = () => {
  const { isLoading, handlers } = useNetworks();
  return (
    <Layout isLoading={isLoading}>
      <BoxCentered css={{ minW: '100%', minH: '100%' }}>
        <Button onPress={handlers.openNetworks} isLoading={isLoading}>
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
    await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
    await NetworkService.addNetwork({ data: MOCK_NETWORKS[1] });
    return {};
  },
];
