import { Box } from '@fuel-ui/react';
import { Mnemonic as FuelMnemonic } from 'fuels';
import { MNEMONIC_SIZE } from '~/config';

import { getWordsFromValue } from '../../utils';

import type { MnemonicProps } from './Mnemonic';
import { Mnemonic } from './Mnemonic';

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
