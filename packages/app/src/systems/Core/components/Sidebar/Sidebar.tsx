import { cssObj } from '@fuel-ui/css';
import type { DrawerProps } from '@fuel-ui/react';
import { Icon, Card, Box, Avatar, Flex, Drawer } from '@fuel-ui/react';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';

import { useAccount } from '../../../Account';
import type { Network } from '../../../Network';
import { NetworkScreen, useNetworks } from '../../../Network';

import type { MenuItemObj } from './components';
import { Menu, NetworkSelector } from './components';
import { sidebarItems } from './constants';

export function Sidebar(
  props: PropsWithChildren<Omit<DrawerProps, 'size' | 'type'>>
) {
  const ref = useRef<HTMLDivElement>();
  const { account } = useAccount();

  const { networks, selectedNetwork } = useNetworks({
    type: NetworkScreen.list,
  });
  return (
    <Flex
      css={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Card css={styles.sidebarWrapper} ref={ref}>
        <Drawer
          size={220}
          type="menu"
          shouldCloseOnClickAway={true}
          containerRef={ref}
          {...props}
        >
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
                      <Avatar.Generated
                        size="lg"
                        hash={account?.address as string}
                      />
                    </Box>

                    <Icon icon="CaretDown" size={20}></Icon>
                  </Flex>
                  <Drawer.CloseButton css={{ top: '$6', right: '$4' }} />
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
          {props.children}
        </Drawer>
      </Card>
    </Flex>
  );
}

const styles = {
  separator: cssObj({
    borderColor: '$gray5',
  }),
  sidebarWrapper: cssObj({
    overflow: 'hidden',
    position: 'fixed',
    maxW: '350px',
    maxH: '610px',
    w: '100%',
    h: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
