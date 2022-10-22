import { Button } from '@fuel-ui/react';
import type { Meta } from '@storybook/react';

import { Pages } from '../../types';

import type { LayoutProps } from './Layout';
import { Layout } from './Layout';
import { TopBarType } from './TopBar';

import { NetworkService } from '~/systems/Network';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';

export default {
  component: Layout,
  title: 'Core/Components/Layout',
  parameters: {
    layout: 'fullscreen',
  },
  loaders: [
    async () => {
      await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
      await NetworkService.addNetwork({ data: MOCK_NETWORKS[1] });
      return {};
    },
  ],
} as Meta;

export const Public = (args: LayoutProps) => (
  <Layout {...args} isPublic>
    Hello world
  </Layout>
);

export const Default = (args: LayoutProps) => (
  <Layout {...args}>
    <Layout.TopBar />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);
Default.parameters = {
  reactRouter: {
    routePath: Pages.wallet(),
  },
};

export const DefaultLoading = (args: LayoutProps) => (
  <Layout {...args} isLoading>
    <Layout.TopBar />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);
DefaultLoading.parameters = {
  reactRouter: {
    routePath: Pages.wallet(),
  },
};

export const Internal = (args: LayoutProps) => (
  <Layout {...args} title="Some Title">
    <Layout.TopBar />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);

export const InternalLoading = (args: LayoutProps) => (
  <Layout {...args} isLoading title="Some Title">
    <Layout.TopBar />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);

export const WithBottom = (args: LayoutProps) => (
  <Layout {...args} title="Some Title">
    <Layout.TopBar />
    <Layout.Content>This is a content</Layout.Content>
    <Layout.BottomBar>
      <Button color="gray" variant="ghost">
        Cancel
      </Button>
      <Button color="accent" variant="solid">
        Save
      </Button>
    </Layout.BottomBar>
  </Layout>
);

export const External = (args: LayoutProps) => (
  <Layout {...args} title="Connect App">
    <Layout.TopBar type={TopBarType.external} />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);

export const ExternalLoading = (args: LayoutProps) => (
  <Layout {...args} isLoading title="Connect App">
    <Layout.TopBar type={TopBarType.external} />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);
