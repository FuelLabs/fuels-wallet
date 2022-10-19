import type { Meta, StoryFn } from '@storybook/react';

import { MOCK_NETWORKS } from '../../__mocks__/networks';
import { NetworkService } from '../../services';

import { UpdateNetwork } from './UpdateNetwork';

import { Pages } from '~/systems/Core';

export default {
  component: UpdateNetwork,
  title: 'Network/Pages/3. UpdateNetwork',
  parameters: {
    reactRouter: {
      routePath: Pages.networkUpdate(),
      routeParams: { id: '3' },
    },
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
  loaders: [
    async () => {
      await NetworkService.clearNetworks();
      await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
      return {};
    },
  ],
} as Meta;

export const Usage: StoryFn<unknown> = () => <UpdateNetwork />;
