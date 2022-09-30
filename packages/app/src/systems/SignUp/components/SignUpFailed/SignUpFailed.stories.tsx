import { BoxCentered } from '@fuel-ui/react';

import { SignUpFailed } from './SignUpFailed';

export default {
  component: SignUpFailed,
  title: 'SignUp/Components/SignUpFailed',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => (
  <BoxCentered minHS>
    <SignUpFailed />
  </BoxCentered>
);
