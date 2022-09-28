import { Box } from "@fuel-ui/react";
import { useState } from "react";

import type { NetworkSelectorProps } from "./NetworkSelector";
import { NetworkSelector } from "./NetworkSelector";

import type { Network } from "~/systems/Network";
import { MOCK_NETWORKS } from "~/systems/Network/__mocks__";

export default {
  component: NetworkSelector,
  title: "Sidebar/Components/NetworkSelector",
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
