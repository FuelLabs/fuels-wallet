import { Box } from '@fuel-ui/react';
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
  <Box.Centered minHS>
    <MnemonicWrite
      onFilled={action('onFilled')}
      onNext={action('onNext')}
      onCancel={action('onCancel')}
    />
  </Box.Centered>
);

export const WithError = () => (
  <Box.Centered minHS>
    <MnemonicWrite
      error="Sorry, your mnemonic doesn't match!"
      onFilled={action('onFilled')}
      onNext={action('onNext')}
      onCancel={action('onCancel')}
    />
  </Box.Centered>
);
