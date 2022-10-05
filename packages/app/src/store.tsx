import { createStore } from '@fuels-wallet/xstore';

import { accountMachine } from '~/systems/Account';
import { networksMachine } from '~/systems/Network';
import { sidebarMachine } from '~/systems/Sidebar';

export enum Services {
  account = 'account',
  networks = 'networks',
  sidebar = 'sidebar',
}

export const store = createStore({
  account: accountMachine,
  networks: networksMachine,
  sidebar: sidebarMachine,
});

export type Store = typeof store;
export const { useStoreSelector, useStoreService } = store;
