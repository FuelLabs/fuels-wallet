import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Text, CardList, Flex, IconButton, Icon } from '@fuel-ui/react';
import { forwardRef } from 'react';

import type { Network } from '../../types';
import { RemoveNetworkDialog } from '../RemoveNetworkDialog/RemoveNetworkDialog';

export function NetworkStatus({ network: _network }: { network: Network }) {
  return (
    <Text
      css={{
        color: _network?.isSelected ? '$accent11' : '$gray8',
        fontSize: '8px',
        ml: '5px',
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
  onUpdate?: (network: Network) => Promise<void> | void;
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
            onPress={() => onUpdate?.(network)}
          />
        )}
        {onRemove && (
          <RemoveNetworkDialog
            network={network}
            onConfirm={() => onRemove?.(network)}
          >
            <IconButton
              variant="link"
              icon={<Icon icon={Icon.is('Trash')} />}
              aria-label="Remove"
            />
          </RemoveNetworkDialog>
        )}
      </Flex>
    );

    return (
      <CardList.Item
        data-testid="fuel_network-item"
        ref={ref}
        onClick={() => onPress?.(network)}
        css={{ ...styles.root, ...css }}
        isActive={network?.isSelected}
        data-active={network?.isSelected}
        {...(showActions && { rightEl: actions })}
      >
        <NetworkStatus network={network} />
        <Text>{network?.name}</Text>
      </CardList.Item>
    );
  }
);

const styles = {
  root: cssObj({
    maxHeight: '36px',
    boxSizing: 'border-box',

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
