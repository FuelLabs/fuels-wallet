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
      title="Confirm phrase"
      subtitle="Write your phrase again to ensure you wrote it down correctly."
      step={2}
      onFilled={action('onFilled')}
      onNext={action('onNext')}
      onCancel={action('onCancel')}
    />
  </Box.Centered>
);

export const WithError = () => (
  <Box.Centered minHS>
    <MnemonicWrite
      title="Confirm phrase"
      subtitle="Write your phrase again to ensure you wrote it down correctly."
      step={2}
      error="Sorry, your mnemonic doesn't match!"
      onFilled={action('onFilled')}
      onNext={action('onNext')}
      onCancel={action('onCancel')}
    />
  </Box.Centered>
);
