import type { LayoutProps } from "./Layout";
import { Layout } from "./Layout";

export default {
  component: Layout,
  title: "Core/Layout",
  parameters: {
    layout: "fullscreen",
  },
};

export const Usage = (args: LayoutProps) => (
  <Layout {...args}>Hello world</Layout>
);

Usage.parameters = {
  layout: "centered",
};
