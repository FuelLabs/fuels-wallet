import type { ThemeUtilsCSS } from "@fuel-ui/css";
import { cssObj } from "@fuel-ui/css";
import { Text, CardList, Flex, IconButton, Icon } from "@fuel-ui/react";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import type { Network } from "../../types";
import { RemoveNetworkDialog } from "../RemoveNetworkDialog/RemoveNetworkDialog";

export function NetworkStatus({ network }: { network: Network }) {
  return (
    <Text
      css={{
        color: network.isOnline ? "$accent11" : "$gray8",
        fontSize: "8px",
      }}
    >
      ●
    </Text>
  );
}

export type NetworkItemProps = {
  css?: ThemeUtilsCSS;
  network: Network;
  showActions?: boolean;
  onRemove?: (network: Network) => Promise<void> | void;
  onPress?: () => void;
};

export const NetworkItem = forwardRef<HTMLDivElement, NetworkItemProps>(
  ({ css, network, showActions, onRemove, onPress }, ref) => {
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
        data-testid="fuel_network-item"
        ref={ref}
        onClick={onPress}
        css={{ ...styles.root, ...css }}
        isActive={network.isSelected}
        {...(showActions && { rightEl: actions })}
      >
        <NetworkStatus network={network} />
        <Text>{network.name}</Text>
      </CardList.Item>
    );
  }
);

const styles = {
  root: cssObj({
    minHeight: "52px",
    boxSizing: "border-box",

    ".fuel_button": {
      px: "$1 !important",
      color: "$gray8",
    },

    ".fuel_button:hover": {
      color: "$gray11",
    },
  }),
};
