import type { Meta, StoryFn } from '@storybook/react';

import { MOCK_NETWORKS } from '../../__mocks__/networks';
import { NetworkService } from '../../services';

import { Networks } from './Networks';

export default {
  component: Networks,
  title: 'Network/Pages/1. Networks',
  loaders: [
    async () => {
      await NetworkService.clearNetworks();
      await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
      await NetworkService.addNetwork({ data: MOCK_NETWORKS[1] });
      return {};
    },
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <Networks />;
