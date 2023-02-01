import { buildBlockExplorerUrl } from 'fuels';

import type { MenuItemObj } from '../components';

import { store } from '~/store';
import { Pages } from '~/systems/Core';

export const sidebarItems = (currentNetworkUrl: string): Array<MenuItemObj> => [
  {
    key: 'wallet',
    icon: 'Wallet',
    label: 'Wallet',
    path: Pages.wallet(),
  },
  {
    key: 'history',
    icon: 'ClockCounterClockwise',
    label: 'History',
    path: Pages.txs(),
  },
  {
    key: 'networks',
    icon: 'ShareNetwork',
    label: 'Networks',
    path: Pages.networks(),
  },
  {
    key: 'accounts',
    icon: 'Users',
    label: 'Accounts',
    path: Pages.accounts(),
  },
  {
    key: 'connected-apps',
    icon: 'PlugsConnected',
    label: 'Connected Apps',
    path: Pages.settingsConnectedApps(),
  },
  {
    key: 'block-explorer',
    icon: 'Rows',
    label: 'Block Explorer',
    ahref: buildBlockExplorerUrl({
      providerUrl: currentNetworkUrl,
      path: ' ',
    }),
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
        onPress() {
          store.goTo('logout');
        },
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
        key: 'forum',
        icon: 'ChatsCircle',
        label: 'Forum',
        ahref: 'https://forum.fuel.network/c/fuel-wallet/15',
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
