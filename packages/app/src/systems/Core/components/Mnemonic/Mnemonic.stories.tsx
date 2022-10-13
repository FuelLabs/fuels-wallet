import { Mnemonic as FuelMnemonic } from '@fuel-ts/mnemonic';
import { Box } from '@fuel-ui/react';

import { getWordsFromValue } from '../../utils';

import type { MnemonicProps } from './Mnemonic';
import { Mnemonic } from './Mnemonic';

import { MNEMONIC_SIZE } from '~/config';

export default {
  component: Mnemonic,
  title: 'Core/Components/Mnemonic',
  parameters: {
    layout: 'fullscreen',
  },
};

const WORDS = getWordsFromValue(FuelMnemonic.generate(MNEMONIC_SIZE));

export const Read = (args: MnemonicProps) => (
  <Box css={{ width: 400 }}>
    <Mnemonic {...args} value={WORDS} type="read" />
  </Box>
);

Read.parameters = {
  layout: 'centered',
};

export const Write = (args: MnemonicProps) => (
  <Box css={{ width: 400 }}>
    <Mnemonic {...args} type="write" />
  </Box>
);

Write.parameters = {
  layout: 'centered',
};
