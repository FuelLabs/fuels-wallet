import { createStore } from '@fuels-wallet/xstore';

import { accountMachine } from '~/systems/Account';
import { networksMachine } from '~/systems/Network';

export enum Services {
  account = 'account',
  networks = 'networks',
}

export const store = createStore({
  account: accountMachine,
  networks: networksMachine,
});

export type Store = typeof store;
export const { useStoreSelector, useStoreService } = store;
