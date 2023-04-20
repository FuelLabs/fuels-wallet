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

const WORDS = ['hello', '', 'this', 'is', 'a', 'test', 'of', '', 'emergency'];
const POSITIONS = [2, 5, 6, 7];
const MNEMONIC_LENGTH = 9;

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
  words: WORDS,
  mnemonicLength: MNEMONIC_LENGTH,
};
