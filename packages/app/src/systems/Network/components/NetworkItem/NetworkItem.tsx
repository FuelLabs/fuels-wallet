import {
  cssObj,
  Box,
  CardList,
  Icon,
  IconButton,
  Text,
  type ThemeUtilsCSS,
} from '@fuel-wallet/ui';
import type { NetworkData } from '@fuel-wallet/types';
import { forwardRef } from 'react';

import { NetworkRemoveDialog } from '../NetworkRemoveDialog/NetworkRemoveDialog';

/** The design system's 8px status square, filled green on the selected network. */
export function NetworkStatus({
  network,
}: {
  network: NetworkData;
  size?: string;
}) {
  return (
    <span
      className="fuel-square"
      aria-hidden
      style={
        network.isSelected
          ? {
              background: 'var(--fuel-primary)',
              borderColor: 'var(--fuel-primary)',
            }
          : undefined
      }
    />
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
    color: '$textHeading',

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
