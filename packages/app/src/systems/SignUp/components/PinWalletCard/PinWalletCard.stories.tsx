import { BoxCentered } from '@fuel-ui/react';

import { PinWalletCard } from './PinWalletCard';

export default {
  component: PinWalletCard,
  title: 'SignUp/Components/PinWalletCard',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => (
  <BoxCentered minHS>
    <PinWalletCard />
  </BoxCentered>
);
