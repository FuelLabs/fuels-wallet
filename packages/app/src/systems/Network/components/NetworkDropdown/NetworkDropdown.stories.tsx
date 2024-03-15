import { Box } from '@fuel-ui/react';
import type { NetworkData } from '@fuel-wallet/types';
import { useState } from 'react';

import { MOCK_NETWORKS } from '../../__mocks__/networks';

import { NetworkDropdown } from './NetworkDropdown';

export default {
  component: NetworkDropdown,
  title: 'Network/Components/NetworkDropdown',
};

export const Usage = () => {
  const [network, setNetwork] = useState<NetworkData>(() => MOCK_NETWORKS[0]);
  return (
    <Box css={{ width: 200 }}>
      <NetworkDropdown selected={network} onPress={(i) => setNetwork(i)} />
    </Box>
  );
};
