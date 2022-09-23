import { Box } from "@fuel-ui/react";
import { action } from "@storybook/addon-actions";

import type { NetworkListProps } from "./NetworkList";
import { NetworkList } from "./NetworkList";

export default {
  component: NetworkList,
  title: "Network/Components/NetworkList",
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

export const Usage = (args: NetworkListProps) => (
  <Box css={{ maxWidth: "$xs" }}>
    <NetworkList
      {...args}
      networks={NETWORKS}
      onUpdate={action("onUpdate")}
      onRemove={action("onRemove")}
      onPress={action("onPress")}
    />
  </Box>
);
