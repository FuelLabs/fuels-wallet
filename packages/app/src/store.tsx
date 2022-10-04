import { createStore } from '@fuels-wallet/xstore';

import { accountEvents } from './systems/Account/events';
import { networkEvents } from './systems/Network/events';

import type { AccountMachine } from '~/systems/Account';
import { accountMachine } from '~/systems/Account';
import type { NetworksMachine } from '~/systems/Network';
import { networksMachine } from '~/systems/Network';

export enum Services {
  account = 'account',
  networks = 'networks',
}

export type StoreMachines = {
  account: AccountMachine;
  networks: NetworksMachine;
};

const services = {
  account: accountMachine,
  networks: networksMachine,
};

export const store = createStore(services, {
  events: (store) => ({
    ...accountEvents(store),
    ...networkEvents(store),
  }),
});

export type Store = typeof store;
