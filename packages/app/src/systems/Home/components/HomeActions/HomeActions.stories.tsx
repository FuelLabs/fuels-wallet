import { Box } from '@fuel-ui/react';

import { HomeActions } from './HomeActions';

export default {
  component: HomeActions,
  title: 'Home/Components/HomeActions',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <HomeActions />
  </Box>
);
