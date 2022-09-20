import { Box } from "@fuel-ui/react";

import type { NetworkSelectorProps } from "./NetworkSelector";
import { NetworkSelector } from "./NetworkSelector";

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

export const Usage = (args: NetworkSelectorProps) => (
  <Box css={{ width: 200 }}>
    <NetworkSelector {...args} networks={NETWORKS} />
  </Box>
);
