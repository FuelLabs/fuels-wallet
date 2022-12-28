import type { ComponentStory, Meta } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { Wallet } from 'fuels';

import { sendLoader } from '../../__mocks__/send';

import { SendPage } from './SendPage';

const wallet = Wallet.generate();

export default {
  component: SendPage,
  title: 'Send/Pages/SendPage',
  viewport: {
    defaultViewport: 'chromeExtension',
  },
  loaders: [sendLoader(wallet)],
} as Meta;

const Template: ComponentStory<typeof SendPage> = () => {
  return <SendPage />;
};

export const Usage = Template.bind({});
Usage.parameters = {
  layout: 'fullscreen',
};
Usage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => canvas.findByLabelText('Select Asset'));
  const select = canvas.getByLabelText('Select Asset');
  userEvent.click(select);
  userEvent.keyboard('{Enter}');
  userEvent.click(await canvas.findByText('Ethereum'));
  userEvent.keyboard('{Enter}');
  userEvent.type(
    canvas.getByLabelText('Address Input'),
    wallet.address.toString()
  );
  const inputAmount = canvas.getByLabelText('amount');
  userEvent.type(inputAmount, '10');
};
