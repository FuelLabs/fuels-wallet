import { createStore } from '@fuel-wallet/xstore';

import { accountDialogEvents, accountEvents } from './systems/Account/events';
import { networkEvents } from './systems/Network/events';

import { accountDialogMachine } from '~/systems/Account/machines/accountDialogMachine';
import { accountMachine } from '~/systems/Account/machines/accountMachine';
import { networksMachine } from '~/systems/Network/machines';

export enum Services {
  accounts = 'accounts',
  accountsDialog = 'accountsDialog',
  networks = 'networks',
}

export type StoreMachines = typeof services;

const services = {
  accountsDialog: () => accountDialogMachine,
  accounts: () => accountMachine,
  networks: () => networksMachine,
};

export const store = createStore(services, {
  events: (store) => ({
    ...accountDialogEvents(store),
    ...accountEvents(store),
    ...networkEvents(store),
  }),
});

export type Store = typeof store;
