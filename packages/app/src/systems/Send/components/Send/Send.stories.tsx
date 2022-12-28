import type { Meta, StoryFn } from '@storybook/react';
import { Wallet } from 'fuels';

import { sendLoader, useTxRequestMock } from '../../__mocks__/send';
import { useSend } from '../../hooks';

import { Send } from '.';

const wallet = Wallet.generate();

export default {
  title: 'Send/Components/Send',
  decorators: [(Story) => <Story />],
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

export const Loading: StoryFn = (_args) => {
  return <Send.Loading />;
};
Loading.parameters = {
  layout: 'fullscreen',
};

export const Select: StoryFn = (_args) => {
  const send = useSend();
  return <Send.Select {...send} />;
};
Select.loaders = [sendLoader(wallet)];
Select.parameters = {
  layout: 'fullscreen',
};

export const Confirm: StoryFn = (_args, { loaded }) => {
  const txRequest = useTxRequestMock(loaded);
  return <Send.Confirm txRequest={txRequest} />;
};
Confirm.loaders = [sendLoader(wallet)];
Confirm.parameters = {
  layout: 'fullscreen',
};
