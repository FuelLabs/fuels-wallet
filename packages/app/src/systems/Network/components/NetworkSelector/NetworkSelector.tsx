/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cssObj } from '@fuel-ui/css';
import { Dropdown, Flex } from '@fuel-ui/react';
import type { Network } from '@fuel-wallet/types';

import { NetworkDropdown } from '..';

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
    <Flex css={styles.root}>
      <Dropdown
        popoverProps={{ side: 'bottom', align: 'start', alignOffset: 10 }}
      >
        <Dropdown.Trigger>
          <NetworkDropdown selected={selected!} />
        </Dropdown.Trigger>
        <Dropdown.Menu
          autoFocus
          disabledKeys={['edit']}
          aria-label="Actions"
          css={{ width: '200px' }}
          onAction={(id) => {
            const network = networks.find((n) => n.id === id);
            network && onSelectNetwork?.(network);
          }}
        >
          {networks.map((network) => (
            <Dropdown.MenuItem key={network.id} textValue={network.name}>
              {network.name}
            </Dropdown.MenuItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Flex>
  );
}

const styles = {
  root: cssObj({
    flexDirection: 'column',
    gap: '$3',
    w: '$full',
    padding: '$3',
    zIndex: '$10',

    '& > .fuel_text': {
      fontSize: '$sm',
    },
  }),
  button: cssObj({
    fontSize: '$md',
    bg: '$gray2 !important',
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
};
