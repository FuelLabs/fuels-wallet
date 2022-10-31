import { Box } from '@fuel-ui/react';

import { UserAddressCard } from './UserAddressCard';

export default {
  component: UserAddressCard,
  title: 'Home/Components/UserAddressCard',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <UserAddressCard address="fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30" />
  </Box>
);
