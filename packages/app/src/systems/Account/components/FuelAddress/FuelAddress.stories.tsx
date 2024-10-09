import { Box } from '@fuel-ui/react';

import { FuelAddress } from './FuelAddress';

export default {
  component: FuelAddress,
  title: 'Account/Components/FuelAddress',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <FuelAddress
      address="fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30"
      canOpenExplorer
    />
  </Box>
);
