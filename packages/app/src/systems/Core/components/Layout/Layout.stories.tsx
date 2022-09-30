import { Button } from '@fuel-ui/react';

import type { LayoutProps } from './Layout';
import { Layout } from './Layout';

export default {
  component: Layout,
  title: 'Core/Components/Layout',
  parameters: {
    layout: 'fullscreen',
  },
};

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

export const DefaultLoading = (args: LayoutProps) => (
  <Layout {...args} isLoading>
    <Layout.TopBar />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);

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
