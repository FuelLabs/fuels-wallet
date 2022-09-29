/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cssObj } from '@fuel-ui/css';
import { Dropdown, Flex, Icon, Text } from '@fuel-ui/react';
import { useEffect, useState } from 'react';

import type { Network } from '~/systems/Network';
import { NetworkStatus, NetworkItem } from '~/systems/Network';

export type NetworkSelectorProps = {
  selected: Network;
  networks: Network[];
  onSelectNetwork?: (network: Network) => void;
};

export function NetworkSelector({ selected, networks, onSelectNetwork }: NetworkSelectorProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const selector = document.querySelector("[data-testid='fuel_network-item']");
    selector && setWidth(selector?.clientWidth);
  }, []);

  return (
    <Flex css={styles.root}>
      <Text as="div" leftIcon={Icon.is('ShareNetwork')}>
        Network selected
      </Text>
      <Dropdown>
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
              <NetworkStatus network={network} />
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

    '& > .fuel_text': {
      fontSize: '$sm',
    },
  }),
  button: cssObj({
    fontSize: '$lg',

    '&:hover': {
      cursor: 'pointer',
    },
    '&::after': {
      background: 'transparent',
    },
  }),
};
