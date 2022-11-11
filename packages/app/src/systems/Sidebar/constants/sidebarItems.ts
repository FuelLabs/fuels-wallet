import { Pages } from '~/systems/Core';

export const sidebarItems = [
  {
    key: 'wallet',
    icon: 'Wallet',
    label: 'Wallet',
    path: Pages.wallet(),
  },
  {
    key: 'settings',
    icon: 'Gear',
    label: 'Settings',
    submenu: [
      {
        key: 'recover-passphrase',
        icon: 'Lock',
        label: 'Recover Passphrase',
        path: '/settings/recover-passphrase',
      },
      {
        key: 'change-password',
        icon: 'Lock',
        label: 'Change Password',
        path: '/settings/change-password',
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
        ahref: 'https://github.com/FuelLabs/fuel-wallet',
      },
      {
        key: 'bugs',
        icon: 'Bug',
        label: 'Report a Bug',
        /** This page isn't created yet */
        ahref: 'https://github.com/FuelLabs/fuel-wallet/issues/new/choose',
      },
    ],
  },
];
