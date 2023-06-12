import { Box } from '@fuel-ui/react';

import { EthAddress } from './EthAddress';

export default {
  component: EthAddress,
  title: 'Account/Components/EthAddress',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <EthAddress address="0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266" />
  </Box>
);
