import { BoxCentered } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';

import { MnemonicRead } from './MnemonicRead';

export default {
  component: MnemonicRead,
  title: 'SignUp/Components/MnemonicRead',
  parameters: {
    layout: 'fullscreen',
  },
};

const WORDS = [
  'strange',
  'purple',
  'adamant',
  'crayons',
  'entice',
  'fun',
  'eloquent',
  'missiles',
  'milk',
  'ice',
  'cream',
  'apple',
];

export const Usage = () => (
  <BoxCentered minHS>
    <MnemonicRead
      words={WORDS}
      onNext={action('onNext')}
      onCancel={action('onCancel')}
    />
  </BoxCentered>
);
