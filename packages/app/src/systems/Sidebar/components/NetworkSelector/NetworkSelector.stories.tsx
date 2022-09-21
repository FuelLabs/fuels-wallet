import { Box } from "@fuel-ui/react";
import { useState } from "react";

import type { NetworkSelectorProps } from "./NetworkSelector";
import { NetworkSelector } from "./NetworkSelector";

import type { Network } from "~/systems/Network";

export default {
  component: NetworkSelector,
  title: "Sidebar/Components/NetworkSelector",
};

const NETWORKS = [
  {
    id: 1,
    isSelected: true,
    isOnline: true,
    name: "Mainnet",
    url: "https://node.fuel.network/graphql",
  },
  {
    id: 2,
    name: "Localhost",
    url: "http://localhost:4000",
  },
];

export const Usage = (args: NetworkSelectorProps) => {
  const [network, setNetwork] = useState<Network>(() => NETWORKS[0]);
  return (
    <Box css={{ width: 200 }}>
      <NetworkSelector
        {...args}
        networks={NETWORKS}
        selected={network}
        onSelectNetwork={(i) => setNetwork(i)}
      />
    </Box>
  );
};
