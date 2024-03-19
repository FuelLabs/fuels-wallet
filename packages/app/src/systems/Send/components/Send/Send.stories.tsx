import type { Meta, StoryFn } from '@storybook/react';
import {
  MOCK_ASSETS_NODE,
  mockBalancesOnGraphQL,
} from '~/systems/Asset/__mocks__/assets';

import { sendLoader } from '../../__mocks__/send';
import { useSend } from '../../hooks';

import { Send } from '.';

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
Select.loaders = [sendLoader()];
Select.parameters = {
  layout: 'fullscreen',
  msw: [mockBalancesOnGraphQL(MOCK_ASSETS_NODE.slice(0, 1))],
};
