import type { Story } from "@storybook/react";

import { HomePage } from "./HomePage";

export default {
  component: HomePage,
  title: "Home/Pages/HomePage",
};

const Template: Story<unknown> = () => <HomePage />;

export const Default = Template.bind({});
Default.args = {};
