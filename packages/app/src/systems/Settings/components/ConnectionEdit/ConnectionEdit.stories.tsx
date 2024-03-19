import { Box } from '@fuel-ui/react';
import { expect } from '@storybook/jest';
import type { ComponentStory, Meta } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

import { connectionsLoader } from '../../__mocks__/connection';
import { useConnections } from '../../hooks';

import { ConnectionEdit } from './ConnectionEdit';

export default {
  component: ConnectionEdit,
  title: 'Settings/Components/ConnectionEdit',
  loaders: [connectionsLoader],
  decorators: [
    (Story) => (
      <Box css={{ height: '100vh' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: ComponentStory<typeof ConnectionEdit> = (args) => {
  const state = useConnections();
  return <ConnectionEdit {...state} {...args} />;
};

export const Usage = Template.bind({});
Usage.parameters = {
  layout: 'fullscreen',
  reactRouter: {
    searchParams: { origin: 'fuellabs.github.io/swayswap' },
  },
};

export const Empty = Template.bind({});
Empty.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => canvas.findByText('Account 1'));
  userEvent.type(canvas.getByLabelText('Search'), 'Not found');
  expect(canvas.getByText('No account found')).toBeInTheDocument();
};
Empty.parameters = {
  layout: 'fullscreen',
  reactRouter: {
    searchParams: { origin: 'fuellabs.github.io/swayswap' },
  },
};
