import type { Meta, StoryFn } from '@storybook/react';
import { Wallet } from 'fuels';
import {
  mockBalancesOnGraphQL,
  MOCK_ASSETS_NODE,
} from '~/systems/Asset/__mocks__/assets';

import { sendLoader } from '../../__mocks__/send';
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

export const Select: StoryFn = (_args) => {
  const send = useSend();
  return <Send.Select {...send} />;
};
Select.loaders = [sendLoader(wallet)];
Select.parameters = {
  layout: 'fullscreen',
  msw: [mockBalancesOnGraphQL(MOCK_ASSETS_NODE.slice(0, 1))],
};
