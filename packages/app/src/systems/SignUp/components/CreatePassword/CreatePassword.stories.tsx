import { BoxCentered } from '@fuel-ui/react';
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
  <BoxCentered minHS>
    <CreatePassword
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
    />
  </BoxCentered>
);
