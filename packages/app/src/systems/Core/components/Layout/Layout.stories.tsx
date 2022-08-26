import { Button } from "@fuel-ui/react";

import type { LayoutProps } from "./Layout";
import { Layout } from "./Layout";

export default {
  component: Layout,
  title: "Core/Layout",
  parameters: {
    layout: "fullscreen",
  },
};

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

export const InternalPage = (args: LayoutProps) => (
  <Layout {...args}>
    <Layout.TopBar title="Some Title" />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);

export const InternalPageLoading = (args: LayoutProps) => (
  <Layout {...args} isLoading>
    <Layout.TopBar title="Some Title" />
    <Layout.Content>This is a content</Layout.Content>
  </Layout>
);

export const WithBottom = (args: LayoutProps) => (
  <Layout {...args}>
    <Layout.TopBar title="Some Title" />
    <Layout.Content>This is a content</Layout.Content>
    <Layout.BottomBar>
      <Button color="gray" variant="ghost" css={{ width: "100%" }}>
        Cancel
      </Button>
      <Button color="accent" variant="solid" css={{ width: "100%" }}>
        Save
      </Button>
    </Layout.BottomBar>
  </Layout>
);
