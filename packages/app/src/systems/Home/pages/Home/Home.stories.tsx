import type { Story } from "@storybook/react";

import { Home } from "./Home";

export default {
  component: Home,
  title: "Home/Pages/Home",
};

const Template: Story<unknown> = () => <Home />;

export const Default = Template.bind({});
Default.args = {};
