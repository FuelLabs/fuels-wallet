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
    icon: 'History',
    label: 'History',
    path: Pages.txs(),
  },
  {
    key: 'networks',
    icon: 'BrandStackshare',
    label: 'Networks',
    onPress() {
      store.openNetworksList();
    },
  },
  {
    key: 'accounts',
    icon: 'Users',
    label: 'Accounts',
    onPress() {
      store.openAccountList();
    },
  },
  {
    key: 'connected-apps',
    icon: 'PlugConnected',
    label: 'Connected Apps',
    path: Pages.settingsConnectedApps(),
  },
  {
    key: 'block-explorer',
    icon: 'DatabaseSearch',
    label: 'Block Explorer',
    ahref: buildBlockExplorerUrl({
      providerUrl: currentNetworkUrl,
      path: ' ',
    }),
  },
  {
    key: 'settings',
    icon: 'Settings',
    label: 'Settings',
    submenu: [
      {
        key: 'assets',
        icon: 'Coins',
        label: 'Assets',
        path: Pages.assets(),
      },
      {
        key: 'view-recovery-phrase',
        icon: 'Lock',
        label: 'View Recovery Phrase',
        onPress() {
          store.openViewRecoveryPhrase();
        },
      },
      {
        key: 'change-password',
        icon: 'Lock',
        label: 'Change Password',
        path: Pages.settingsChangePassword(),
      },
      {
        key: 'logout',
        icon: 'Logout',
        label: 'Logout',
        onPress() {
          store.openAccountsLogout();
        },
      },
    ],
  },
  {
    key: 'support',
    icon: 'HelpCircle',
    label: 'Support',
    submenu: [
      {
        key: 'discord',
        icon: 'BrandDiscordFilled',
        label: 'Fuel Discord',
        ahref: 'https://discord.com/invite/xfpK4Pe',
      },
      {
        key: 'forum',
        icon: 'MessageCircle',
        label: 'Forum',
        ahref: 'https://forum.fuel.network/c/fuel-wallet/15',
      },
      {
        key: 'github',
        icon: 'BrandGithubFilled',
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
  {
    key: 'lock-wallet',
    icon: 'Lock',
    label: 'Lock Wallet',
    onPress() {
      store.lock();
    },
  },
];
