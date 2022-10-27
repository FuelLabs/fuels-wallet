import { Box } from '@fuel-ui/react';
import type { Network } from '@fuels-wallet/types';
import { useState } from 'react';

import type { NetworkSelectorProps } from './NetworkSelector';
import { NetworkSelector } from './NetworkSelector';

import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';

export default {
  component: NetworkSelector,
  title: 'Sidebar/Components/NetworkSelector',
};

export const Usage = (args: NetworkSelectorProps) => {
  const [network, setNetwork] = useState<Network>(() => MOCK_NETWORKS[0]);
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
