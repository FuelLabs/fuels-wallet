import { Box } from '@fuel-ui/react';
import type { NetworkData } from '@fuel-wallet/types';
import { useState } from 'react';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';

import type { NetworkSelectorProps } from './NetworkSelector';
import { NetworkSelector } from './NetworkSelector';

export default {
  component: NetworkSelector,
  title: 'Network/Components/NetworkSelector',
};

export const Usage = (args: NetworkSelectorProps) => {
  const [network, setNetwork] = useState<NetworkData>(() => MOCK_NETWORKS[0]);
  return (
    <Box css={{ width: 200 }}>
      <NetworkSelector
        {...args}
        networks={MOCK_NETWORKS}
        selected={network}
        onSelectNetwork={(i) => setNetwork(i)}
      />
    </Box>
  );
};
