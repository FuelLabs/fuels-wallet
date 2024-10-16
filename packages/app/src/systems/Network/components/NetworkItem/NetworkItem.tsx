import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, CardList, Icon, IconButton, Text } from '@fuel-ui/react';
import type { NetworkData } from '@fuel-wallet/types';
import { forwardRef } from 'react';

import { NetworkRemoveDialog } from '../NetworkRemoveDialog/NetworkRemoveDialog';

export function NetworkStatus({ network }: { network: NetworkData }) {
  return (
    <Text
      as="span"
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        color: network.isSelected ? '$intentsPrimary11' : '$intentsBase8',
        fontSize: '16px',
        height: '$4',
      }}
    >
      ●
    </Text>
  );
}

export type NetworkItemProps = {
  css?: ThemeUtilsCSS;
  network: NetworkData;
  onPress?: (network: NetworkData) => Promise<void> | void;
  onRemove?: (network: NetworkData) => Promise<void> | void;
  onUpdate?: (id?: string) => Promise<void> | void;
};

export const NetworkItem = forwardRef<HTMLDivElement, NetworkItemProps>(
  ({ css, network, onRemove, onUpdate, onPress }, ref) => {
    const showActions = Boolean(onUpdate || onRemove);
    const actions = (
      <Box.Flex gap="$2">
        {onUpdate && (
          <IconButton
            variant="link"
            icon={<Icon icon={Icon.is('Edit')} />}
            aria-label="Update"
            onPress={() => onUpdate?.(network.id)}
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
      </Box.Flex>
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
        <Text aria-label="Network name">{network?.name}</Text>
      </CardList.Item>
    );
  }
);

const styles = {
  root: cssObj({
    minHeight: '52px',
    boxSizing: 'border-box',
    background: '$cardBg',

    '&:hover': {
      cursor: 'pointer',
    },

    '.fuel_Button': {
      px: '$1 !important',
      color: '$intentsBase8',
    },

    '.fuel_Button:hover': {
      color: '$intentsBase11',
    },
  }),
};
