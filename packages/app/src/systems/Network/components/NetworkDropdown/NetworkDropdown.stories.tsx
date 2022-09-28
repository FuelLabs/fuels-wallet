import { Box } from "@fuel-ui/react";
import { useState } from "react";

import { MOCK_NETWORKS } from "../../__mocks__";

import { NetworkDropdown } from "./NetworkDropdown";

import type { Network } from "~/systems/Network";

export default {
  component: NetworkDropdown,
  title: "Network/Components/NetworkDropdown",
};

export const Usage = () => {
  const [network, setNetwork] = useState<Network>(() => MOCK_NETWORKS[0]);
  return (
    <Box css={{ width: 200 }}>
      <NetworkDropdown selected={network} onPress={(i) => setNetwork(i)} />
    </Box>
  );
};
