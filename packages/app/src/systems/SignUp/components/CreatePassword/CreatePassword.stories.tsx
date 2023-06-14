import { Box } from '@fuel-ui/react';
import { action } from '@storybook/addon-actions';

import { CreatePassword } from './CreatePassword';

export default {
  component: CreatePassword,
  title: 'SignUp/Components/CreatePassword',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => (
  <Box.Centered minHS>
    <CreatePassword
      step={2}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
    />
  </Box.Centered>
);
