import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Text, CardList, Flex, IconButton, Icon } from '@fuel-ui/react';
import type { Network } from '@fuel-wallet/types';
import { forwardRef } from 'react';

import { NetworkRemoveDialog } from '../NetworkRemoveDialog/NetworkRemoveDialog';

export function NetworkStatus({ network: _network }: { network: Network }) {
  return (
    <Text
      css={{
        // color: network.isOnline ? '$accent11' : '$gray8',
        fontSize: '8px',
      }}
    >
      ●
    </Text>
  );
}

export type NetworkItemProps = {
  css?: ThemeUtilsCSS;
  network: Network;
  onPress?: (network: Network) => Promise<void> | void;
  onRemove?: (network: Network) => Promise<void> | void;
  onUpdate?: (id: string) => Promise<void> | void;
};

export const NetworkItem = forwardRef<HTMLDivElement, NetworkItemProps>(
  ({ css, network, onRemove, onUpdate, onPress }, ref) => {
    const showActions = Boolean(onUpdate || onRemove);
    const actions = (
      <Flex gap="$2">
        {onUpdate && (
          <IconButton
            variant="link"
            icon={<Icon icon={Icon.is('Pencil')} />}
            aria-label="Update"
            onPress={() => onUpdate?.(network.id as string)}
          />
        )}
        {onRemove && (
          <NetworkRemoveDialog
            network={network}
            onConfirm={() => onRemove?.(network)}
          >
            <IconButton
              variant="link"
              icon={<Icon icon={Icon.is('Trash')} />}
              aria-label="Remove"
            />
          </NetworkRemoveDialog>
        )}
      </Flex>
    );

    return (
      <CardList.Item
        aria-label={`fuel_network-item-${network?.id}`}
        ref={ref}
        onClick={() => onPress?.(network)}
        css={{ ...styles.root, ...css }}
        isActive={network?.isSelected}
        data-active={network?.isSelected}
        {...(showActions && { rightEl: actions })}
      >
        {/* <NetworkStatus network={network} /> */}
        <Text>{network?.name}</Text>
      </CardList.Item>
    );
  }
);

const styles = {
  root: cssObj({
    minHeight: '52px',
    boxSizing: 'border-box',
    background: '$whiteA2',

    '&:hover': {
      cursor: 'pointer',
    },

    '.fuel_button': {
      px: '$1 !important',
      color: '$gray8',
    },

    '.fuel_button:hover': {
      color: '$gray11',
    },
  }),
};
