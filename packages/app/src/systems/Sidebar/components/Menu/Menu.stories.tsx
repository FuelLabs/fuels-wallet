import { Box } from '@fuel-ui/react';

import { Menu } from './Menu';
import type { MenuItemObj, MenuProps } from './types';

export default {
  component: Menu,
  title: 'Sidebar/Components/Menu',
};

const ITEMS: MenuItemObj[] = [
  { key: 'wallet', icon: 'Wallet', label: 'Wallet', path: '/wallet' },
  { key: 'bridge', icon: 'ArrowsExchange', label: 'Bridge', path: '/bridge' },
  {
    key: 'settings',
    icon: 'Settings',
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
        icon: 'BrandStackshare',
        label: 'Networks',
        path: '/settings/networks',
      },
      {
        key: 'connected-apps',
        icon: 'PlugConnected',
        label: 'Connected Apps',
        path: '/settings/connected-apps',
      },
    ],
  },
  {
    key: 'support',
    icon: 'HelpCircle',
    label: 'Support',
    submenu: [
      {
        key: 'contact',
        icon: 'Mail',
        label: 'Contact Us',
        /** This page isn't created yet */
        ahref: 'https://fuel.network',
      },
      {
        key: 'discord',
        icon: 'BrandDiscordFilled',
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
