import { Box } from '@fuel-ui/react';
import { expect } from '@storybook/jest';
import type { ComponentStory, Meta } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

import { connectionsLoader } from '../../__mocks__/connection';
import { useConnections } from '../../hooks';
import type { ConnectionStatus } from '../../machines';

import { ConnectionList } from './ConnectionList';

export default {
  component: ConnectionList,
  title: 'Settings/Components/ConnectionList',
  loaders: [connectionsLoader],
  decorators: [
    (Story) => (
      <Box css={{ height: '100vh' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const Template: ComponentStory<typeof ConnectionList> = (args) => {
  const state = useConnections();
  return <ConnectionList {...state} {...args} />;
};

export const Usage = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  status: (val: keyof typeof ConnectionStatus) => {
    if (val === 'loading') return true;
    return false;
  },
};

export const Empty = Template.bind({});
Empty.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => canvas.findByText('uniswap.org'));
  userEvent.type(canvas.getByLabelText('Search'), 'Not found');
  expect(canvas.getByText('No connection found')).toBeInTheDocument();
};
