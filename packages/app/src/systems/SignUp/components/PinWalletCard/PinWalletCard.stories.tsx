import { Box } from '@fuel-ui/react';

import { PinWalletCard } from './PinWalletCard';

export default {
  component: PinWalletCard,
  title: 'SignUp/Components/PinWalletCard',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage = () => (
  <Box.Centered minHS>
    <PinWalletCard />
  </Box.Centered>
);
