import { Box, CardList } from "@fuel-ui/react";

import { NetworkItem } from "./NetworkItem";

export default {
  component: NetworkItem,
  title: "Network/Components/NetworkItem",
};

const NETWORK = {
  id: 1,
  isSelected: true,
  isOnline: true,
  name: "Mainnet",
  url: "https://node.fuel.network/graphql",
};

export const Usage = () => (
  <Box css={{ maxWidth: "$xs" }}>
    <CardList>
      <NetworkItem network={NETWORK} />
    </CardList>
  </Box>
);

export const WithActions = () => {
  return (
    <Box css={{ maxWidth: "$xs" }}>
      <CardList>
        <NetworkItem network={NETWORK} showActions />
      </CardList>
    </Box>
  );
};
