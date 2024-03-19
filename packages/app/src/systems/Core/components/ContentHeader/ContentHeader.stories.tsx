import { Text } from '@fuel-ui/react';
import type { Meta, StoryFn } from '@storybook/react';

import { ContentHeader } from '.';

export default {
  component: ContentHeader,
  title: 'Core/Components/ContentHeader',
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: StoryFn<typeof ContentHeader> = (args) => (
  <ContentHeader {...args} />
);

export const Usage = Template.bind({});
Usage.args = {
  title: 'Confirm Transaction',
  children: (
    <Text>
      Carefully check if all the details in your transaction are correct
    </Text>
  ),
};

export const NoChildren = Template.bind({});
NoChildren.args = {
  title: 'Confirm Transaction',
};
