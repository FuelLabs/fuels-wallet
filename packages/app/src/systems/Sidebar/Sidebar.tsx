import { cssObj } from '@fuel-ui/css';
import { Icon, Box, Avatar, Flex, Drawer } from '@fuel-ui/react';

import { useAccount } from '../Account';
import type { Network } from '../Network';
import { NetworkScreen, useNetworks } from '../Network';

import type { MenuItemObj } from './components';
import { Menu, NetworkSelector } from './components';
import { sidebarItems } from './constants';

export function Sidebar() {
  const { account } = useAccount();

  const { networks, selectedNetwork } = useNetworks({
    type: NetworkScreen.list,
  });
  return (
    <Flex
      css={{
        flex: 1,
        height: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Flex css={{ flex: 1, flexDirection: 'column' }}>
        <Flex
          css={{
            padding: '$2',
            justifyContent: 'space-between',
            flex: 1,
            borderBottomWidth: 'thin',
            borderBottomStyle: 'dashed',
            mb: '$4',

            ...styles.separator,
          }}
        >
          <Flex
            css={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: '$2',
            }}
          >
            <Box
              css={{
                borderRadius: '$full',
                background: '$accent11',
              }}
            >
              <Avatar.Generated size="md" hash={account?.address as string} />
            </Box>

            <Icon icon="CaretDown" size={20}></Icon>
          </Flex>
          <Drawer.CloseButton
            css={{ top: '$5', right: '$4' }}
            data-testid="drawer_closeButton"
          />
        </Flex>

        <Menu items={sidebarItems as MenuItemObj[]} />
      </Flex>
      <Flex
        css={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopWidth: 'thin',
          borderTopStyle: 'dashed',
          mt: '$4',
          ...styles.separator,
        }}
      >
        <NetworkSelector
          selected={selectedNetwork as Network}
          networks={networks}
        />
      </Flex>
    </Flex>
  );
}

const styles = {
  separator: cssObj({
    borderColor: '$gray5',
  }),
  sidebarWrapper: cssObj({
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '350px',
    flex: 1,
    maxHeight: '615px',
    borderRadius: '$md',
    w: '100%',
    h: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
