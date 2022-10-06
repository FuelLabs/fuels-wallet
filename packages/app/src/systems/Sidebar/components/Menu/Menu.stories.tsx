import { Box } from '@fuel-ui/react';

import type { MenuItemObj, MenuProps } from './Menu';
import { Menu } from './Menu';

export default {
  component: Menu,
  title: 'Sidebar/Components/Menu',
};

const ITEMS: MenuItemObj[] = [
  { key: 'wallet', icon: 'Wallet', label: 'Wallet', path: '/wallet' },
  { key: 'bridge', icon: 'Swap', label: 'Bridge', path: '/bridge' },
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
];

export const Usage = (args: MenuProps) => (
  <Box css={{ width: 220 }}>
    <Menu {...args} items={ITEMS} />
  </Box>
);
