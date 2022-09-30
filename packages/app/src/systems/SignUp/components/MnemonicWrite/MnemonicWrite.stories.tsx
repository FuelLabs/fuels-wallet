import { BoxCentered } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';

import { MnemonicWrite } from './MnemonicWrite';

export default {
  component: MnemonicWrite,
  title: 'SignUp/Components/MnemonicWrite',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => (
  <BoxCentered minHS>
    <MnemonicWrite
      onFilled={action('onFilled')}
      onNext={action('onNext')}
      onCancel={action('onCancel')}
    />
  </BoxCentered>
);

export const WithError = () => (
  <BoxCentered minHS>
    <MnemonicWrite
      error="Sorry, your mnemonic doesn't match!"
      onFilled={action('onFilled')}
      onNext={action('onNext')}
      onCancel={action('onCancel')}
    />
  </BoxCentered>
);
