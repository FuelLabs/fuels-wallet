import { Pages } from '~/systems/Core';

export const sidebarItems = [
  {
    key: 'wallet',
    icon: 'Wallet',
    label: 'Wallet',
    path: Pages.wallet(),
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
