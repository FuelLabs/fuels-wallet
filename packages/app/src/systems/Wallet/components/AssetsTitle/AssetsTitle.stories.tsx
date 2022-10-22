import { Box } from '@fuel-ui/react';

import { AssetsTitle } from './AssetsTitle';

export default {
  component: AssetsTitle,
  title: 'Home/Components/AssetsTitle',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <AssetsTitle />
  </Box>
);
