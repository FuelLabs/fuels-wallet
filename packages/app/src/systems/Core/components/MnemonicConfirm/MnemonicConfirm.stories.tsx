import { Box } from '@fuel-ui/react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { MnemonicConfirm } from './MnemonicConfirm';

export default {
  component: MnemonicConfirm,
  title: 'Core/Components/MnemonicConfirm',
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MnemonicConfirm>;

const WORDS = [
  'hello',
  'world',
  'this',
  'is',
  'a',
  'test',
  'of',
  'the',
  'emergency',
];
const POSITIONS = [4, 5, 7, 3, 2, 6, 8, 1, 9];

const Template: ComponentStory<typeof MnemonicConfirm> = (args) => (
  <Box css={{ width: 400 }}>
    <MnemonicConfirm {...args} />
  </Box>
);

export const Confirm = Template.bind({});
Confirm.parameters = {
  layout: 'centered',
};

Confirm.args = {
  positions: POSITIONS,
  value: WORDS,
};
