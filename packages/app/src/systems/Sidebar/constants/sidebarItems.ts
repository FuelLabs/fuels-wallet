import type { MenuItemObj } from '../components';

import { Pages } from '~/systems/Core';

export const sidebarItems: Array<MenuItemObj> = [
  {
    key: 'wallet',
    icon: 'Wallet',
    label: 'Wallet',
    path: Pages.wallet(),
  },
  {
    key: 'activity',
    icon: 'Bell',
    label: 'Activity',
    path: Pages.txs(),
  },
  {
    key: 'connected-apps',
    icon: 'PlugsConnected',
    label: 'Connected Apps',
    path: Pages.settingsConnectedApps(),
  },
  {
    key: 'settings',
    icon: 'Gear',
    label: 'Settings',
    submenu: [
      {
        key: 'reveal-passphrase',
        icon: 'Lock',
        label: 'Reveal Passphrase',
        path: Pages.settingsRevealPassphrase(),
      },
      {
        key: 'change-password',
        icon: 'Lock',
        label: 'Change Password',
        path: Pages.settingsChangePassword(),
      },
      {
        key: 'logout',
        icon: 'SignOut',
        label: 'Logout',
        path: Pages.logout(),
      },
    ],
  },
  {
    key: 'support',
    icon: 'Question',
    label: 'Support',
    submenu: [
      {
        key: 'discord',
        icon: 'DiscordLogo',
        label: 'Fuel Discord',
        ahref: 'https://discord.com/invite/xfpK4Pe',
      },
      {
        key: 'github',
        icon: 'GithubLogo',
        label: 'Github',
        ahref: 'https://github.com/FuelLabs/fuels-wallet',
      },
      {
        key: 'bugs',
        icon: 'Bug',
        label: 'Report a Bug',
        /** This page isn't created yet */
        ahref: 'https://github.com/FuelLabs/fuels-wallet/issues/new/choose',
      },
    ],
  },
];
