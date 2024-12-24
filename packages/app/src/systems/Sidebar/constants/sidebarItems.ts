import { store } from '~/store';
import { Pages } from '~/systems/Core';

import type { MenuItemObj } from '../components/Menu/types';

export const sidebarItems = (hasErrors: boolean): Array<MenuItemObj> =>
  (
    [
      {
        key: 'wallet',
        icon: 'Wallet',
        label: 'Wallet',
        path: Pages.wallet(),
      },
      {
        key: 'history',
        icon: 'History',
        label: 'Transaction History',
        path: Pages.txs(),
      },
      {
        key: 'networks',
        icon: 'BrandStackshare',
        label: 'Networks Management',
        onPress() {
          store.openNetworksList();
        },
      },
      {
        key: 'accounts',
        icon: 'Users',
        label: 'Account Management',
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
      hasErrors
        ? {
            key: 'hasErrors',
            icon: 'AlertTriangle',
            label: 'Review Errors',
            path: Pages.errors(),
            badge: true,
          }
        : undefined,
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
            key: 'view-seed-phrase',
            icon: 'Lock',
            label: 'View Seed Phrase',
            onPress() {
              store.openViewSeedPhrase();
            },
          },
          {
            key: 'change-password',
            icon: 'Lock',
            label: 'Change Password',
            path: Pages.settingsChangePassword(),
          },
          {
            // added this object
            key: 'set-lock-timeout',
            icon: 'Clock',
            label: 'Auto Lock',
            path: Pages.settingsSetLockTimeout(),
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
    ] as Array<MenuItemObj | undefined>
  ).filter((item) => item !== undefined) as Array<MenuItemObj>;
