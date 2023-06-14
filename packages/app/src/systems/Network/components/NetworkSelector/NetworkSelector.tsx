/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cssObj } from '@fuel-ui/css';
import { Box, Dropdown } from '@fuel-ui/react';
import type { Network } from '@fuel-wallet/types';

import { NetworkDropdown } from '../NetworkDropdown';

export type NetworkSelectorProps = {
  selected: Network;
  networks: Network[];
  onSelectNetwork?: (network: Network) => void;
};

export function NetworkSelector({
  selected,
  networks,
  onSelectNetwork,
}: NetworkSelectorProps) {
  return (
    <Box.Flex css={styles.root}>
      <Dropdown
        popoverProps={{ side: 'bottom', align: 'start', alignOffset: 10 }}
      >
        <Dropdown.Trigger>
          <NetworkDropdown selected={selected!} />
        </Dropdown.Trigger>
        <Dropdown.Menu
          autoFocus
          autoFocusKey={selected.id}
          disabledKeys={['edit']}
          aria-label="Actions"
          css={styles.dropdownMenu}
          onAction={(id) => {
            const network = networks.find((n) => n.id === id);
            network && onSelectNetwork?.(network);
          }}
        >
          {networks.map((network) => (
            <Dropdown.MenuItem
              key={network.id}
              textValue={network.name}
              aria-label={`fuel_network-dropdown-item-${network.id}`}
              css={styles.networkItem(selected.id === network.id)}
            >
              {network.name}
            </Dropdown.MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    flexDirection: 'column',
    gap: '$3',
    w: '$full',
    padding: '$3',
    zIndex: '$10',

    '& > .fuel_Text': {
      fontSize: '$sm',
    },
  }),
  button: cssObj({
    fontSize: '$md',
    bg: '$intentsBase2 !important',
    flex: 1,
    minH: '36px',
    w: '200',
    p: '$2',
    py: '$2',
    '&:hover': {
      cursor: 'pointer',
    },
    '&::after': {
      background: 'transparent',
    },
  }),
  dropdownMenu: cssObj({
    boxShadow: '0 2px 3px 4px rgb(0 0 0 / 20%)',
    width: '200px',
  }),
  networkItem: (active: boolean) =>
    cssObj({
      position: 'relative',
      border: '1px solid $intentsBase3',

      '&:not(:first-child)': {
        marginTop: 8,
      },

      ...(active && {
        '&::after': {
          position: 'absolute',
          display: 'block',
          content: '""',
          top: 0,
          left: 0,
          width: '3px',
          height: '$9',
          background: '$accent11',
          borderRadius: '$md 0 0 $md',
        },
      }),
    }),
};
