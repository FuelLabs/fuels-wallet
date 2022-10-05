import { cssObj } from '@fuel-ui/css';
import type { DrawerProps } from '@fuel-ui/react';
import { Box, Avatar, IconButton, Flex, Drawer } from '@fuel-ui/react';

import { useAccount } from '../Account';
import type { Network } from '../Network';
import { NetworkScreen, useNetworks } from '../Network';

import type { MenuItemObj } from './components';
import { Menu, NetworkSelector } from './components';
import { sidebarRoutes } from './components/constants';
import { useSideBar } from './hooks/useSidebar';

export function Sidebar(props: DrawerProps) {
  const { account } = useAccount();
  const { toggle } = useSideBar();
  const { networks, selectedNetwork } = useNetworks({
    type: NetworkScreen.list,
  });
  return (
    <Drawer shouldCloseOnClickAway={true} {...props}>
      <Drawer.Content>
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
                borderBottomStyle: 'solid',
                mb: '$4',
                ...styles.separator,
              }}
            >
              <Box
                css={{
                  borderRadius: '$full',
                  background: '$accent11',
                }}
              >
                <Avatar.Generated size="lg" hash={account?.address as string} />
              </Box>
              <IconButton
                css={{
                  bg: 'transparent !important',
                  color: '$white !important',
                }}
                icon="X"
                aria-label="close"
                onClick={toggle}
              />
            </Flex>

            <Menu items={sidebarRoutes as MenuItemObj[]} />
          </Flex>
          <Flex
            css={{
              flex: 2,
              alignItems: 'center',
              justifyContent: 'center',
              borderTopWidth: 'thin',
              borderTopStyle: 'solid',
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
      </Drawer.Content>
    </Drawer>
  );
}

const styles = {
  separator: cssObj({
    borderColor: '$gray5',
  }),
};
