import type { Meta, StoryFn } from '@storybook/react';
import { Wallet } from 'fuels';

import { sendLoader, useTxRequestMock } from '../../__mocks__/send';
import { useSend } from '../../hooks';

import { Send } from '.';

const wallet = Wallet.generate();

export default {
  title: 'Send/Components/Send',
  loaders: [sendLoader(wallet)],
  decorators: [(Story) => <Story />],
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

export const Select: StoryFn = (_args) => {
  const send = useSend();
  return <Send.Select {...send} />;
};
Select.parameters = {
  layout: 'fullscreen',
};

export const Confirm: StoryFn = (_args, { loaded }) => {
  const txRequest = useTxRequestMock(loaded);
  return <Send.Confirm txRequest={txRequest} />;
};
Confirm.parameters = {
  layout: 'fullscreen',
};

export const Success: StoryFn = (_args, { loaded }) => {
  const txRequest = useTxRequestMock(loaded);
  return <Send.Success txRequest={txRequest} />;
};
Success.parameters = {
  layout: 'fullscreen',
};

export const Failed: StoryFn = (_args, { loaded }) => {
  const txRequest = useTxRequestMock(loaded);
  return <Send.Failed txRequest={txRequest} />;
};
Failed.parameters = {
  layout: 'fullscreen',
};
