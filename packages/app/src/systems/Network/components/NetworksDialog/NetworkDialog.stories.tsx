import { BoxCentered, Button } from '@fuel-ui/react';
import type { Meta } from '@storybook/react';

import { NetworksDialog } from './NetworksDialog';

import { NetworkService, useNetworks } from '~/systems/Network';

async function loader() {
  await NetworkService.clearNetworks();
  await NetworkService.addDefaultNetworks();
  return {};
}

export default {
  component: NetworksDialog,
  title: 'Network/Components/NetworksDialog',
  loaders: [loader],
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

export const Usage = () => {
  const { handlers, isLoading } = useNetworks();

  return (
    <BoxCentered css={{ minW: '100%', minH: '100%' }}>
      <NetworksDialog />
      <Button onPress={handlers.openNetworks} isLoading={isLoading}>
        Toggle Modal
      </Button>
    </BoxCentered>
  );
};
