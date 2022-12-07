import { createStore } from '@fuel-wallet/xstore';

import { accountEvents } from './systems/Account/events';
import { networkEvents } from './systems/Network/events';

import { accountMachine } from '~/systems/Account/machines';
import { networksMachine } from '~/systems/Network/machines';

export enum Services {
  account = 'account',
  networks = 'networks',
}

export type StoreMachines = typeof services;

const services = {
  account: () => accountMachine,
  networks: () => networksMachine,
};

export const store = createStore(services, {
  events: (store) => ({
    ...accountEvents(store),
    ...networkEvents(store),
  }),
});

export type Store = typeof store;
