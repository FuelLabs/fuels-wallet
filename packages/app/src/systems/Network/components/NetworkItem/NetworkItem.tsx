import { cssObj } from "@fuel-ui/css";
import { Text, CardList, Flex, IconButton, Icon } from "@fuel-ui/react";
import { useNavigate } from "react-router-dom";

import type { Network } from "../../types";
import { RemoveNetworkDialog } from "../RemoveNetworkDialog/RemoveNetworkDialog";

export type NetworkItemProps = {
  network: Network;
  showActions?: boolean;
  onRemove?: (network: Network) => Promise<void> | void;
};

export function NetworkItem({
  network,
  showActions,
  onRemove,
}: NetworkItemProps) {
  const navigate = useNavigate();
  const actions = (
    <Flex gap="$2">
      <IconButton
        variant="link"
        icon={<Icon icon={Icon.is("Pencil")} />}
        aria-label="Edit"
        onClick={() => navigate(`/network/${network.id}`)}
      />
      <RemoveNetworkDialog
        network={network}
        onConfirm={() => onRemove?.(network)}
      >
        <IconButton
          variant="link"
          icon={<Icon icon={Icon.is("Trash")} />}
          aria-label="Remove"
          onClick={() => navigate(`/network/${network.id}`)}
        />
      </RemoveNetworkDialog>
    </Flex>
  );

  return (
    <CardList.Item
      css={styles.root}
      isActive={network.isSelected}
      {...(showActions && { rightEl: actions })}
    >
      <Text
        css={{
          color: network.isOnline ? "$accent11" : "$gray8",
          fontSize: "$xs",
        }}
      >
        ●
      </Text>
      <Text>{network.name}</Text>
    </CardList.Item>
  );
}

const styles = {
  root: cssObj({
    ".fuel_button": {
      px: "$1 !important",
      color: "$gray8",
    },
    ".fuel_button:hover": {
      color: "$gray11",
    },
  }),
};
