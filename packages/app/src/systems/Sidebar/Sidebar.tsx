import { cssObj } from '@fuel-ui/css';
import type { DrawerProps } from '@fuel-ui/react';
import { Avatar, IconButton, Flex, Drawer } from '@fuel-ui/react';

import { useAccount } from '../Account';
import type { Network } from '../Network';
import { NetworkScreen, useNetworks } from '../Network';

import { Menu, NetworkSelector } from './components';
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
              <Avatar.Generated size="lg" hash={account?.address as string} />
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

            <Menu
              items={[
                {
                  key: 'wallet',
                  icon: 'Wallet',
                  label: 'Wallet',
                  path: '/wallet',
                },
                {
                  key: 'settings',
                  icon: 'Gear',
                  label: 'Settings',
                  submenu: [
                    {
                      key: 'my-account',
                      icon: 'User',
                      label: 'My Account',
                      path: '/settings/my-accounts',
                    },
                    {
                      key: 'recover-passphrase',
                      icon: 'Lock',
                      label: 'Recover Passphrase',
                      path: '/settings/recover-passphrase',
                    },
                    {
                      key: 'networks',
                      icon: 'ShareNetwork',
                      label: 'Networks',
                      path: '/settings/networks',
                    },
                    {
                      key: 'connected-apps',
                      icon: 'PlugsConnected',
                      label: 'Connected Apps',
                      path: '/settings/connected-apps',
                    },
                  ],
                },
                {
                  key: 'support',
                  icon: 'Question',
                  label: 'Support',
                  submenu: [
                    {
                      key: 'contact',
                      icon: 'Envelope',
                      label: 'Contact Us',
                      /** This page isn't created yet */
                      ahref: 'https://fuel.network',
                    },
                    {
                      key: 'discord',
                      icon: 'DiscordLogo',
                      label: 'Fuel Discord',
                      ahref: 'https://discord.com/invite/xfpK4Pe',
                    },
                    {
                      key: 'bugs',
                      icon: 'Bug',
                      label: 'Report a Bug',
                      /** This page isn't created yet */
                      ahref: 'https://fuel.network',
                    },
                  ],
                },
              ]}
            />
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
