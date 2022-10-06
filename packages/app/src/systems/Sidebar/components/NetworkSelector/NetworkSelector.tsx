/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cssObj } from '@fuel-ui/css';
import { Dropdown, Flex, Icon, Text } from '@fuel-ui/react';
import { useEffect, useState } from 'react';

import type { Network } from '~/systems/Network';
import { NetworkItem } from '~/systems/Network';

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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const selector = document.querySelector(
      "[data-testid='fuel_network-item']"
    );
    selector && setWidth(selector?.clientWidth);
  }, []);

  return (
    <Flex css={styles.root}>
      <Text as="div" leftIcon={Icon.is('ShareNetwork')}>
        Network selected
      </Text>
      <Dropdown popoverProps={{ side: 'top' }}>
        <Dropdown.Trigger>
          <NetworkItem network={selected!} css={styles.button} />
        </Dropdown.Trigger>
        <Dropdown.Menu
          autoFocus
          disabledKeys={['edit']}
          aria-label="Actions"
          css={{ width }}
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

    '& > .fuel_text': {
      fontSize: '$sm',
    },
  }),
  button: cssObj({
    fontSize: '$md',
    bg: '$gray4 !important',
    flex: 1,
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
