import { CardList } from "@fuel-ui/react";

import type { Network } from "../../types";
import type { NetworkItemProps } from "../NetworkItem";
import { NetworkItem } from "../NetworkItem";

export type NetworkListProps = Omit<NetworkItemProps, "network"> & {
  networks: Network[];
};

export function NetworkList({
  networks,
  onRemove,
  showActions,
}: NetworkListProps) {
  return (
    <CardList>
      {networks.map((network) => (
        <NetworkItem
          key={network.id}
          network={network}
          onRemove={onRemove}
          showActions={showActions}
        />
      ))}
    </CardList>
  );
}
