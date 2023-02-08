import { createStore } from '@fuel-wallet/xstore';

import { accountsMachine, accountsDialogMachine } from '../Account';
import { accountDialogEvents, accountEvents } from '../Account/events';
import { networksMachine } from '../Network';
import { networkEvents } from '../Network/events';

import type { StoreMachines } from './types';
import { Services } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
  persistedStates: ['networks'],
});

export const store = store$
  .addMachine(Services.accounts, () => accountsMachine)
  .addMachine(Services.networks, () => networksMachine)
  .addMachine(Services.accountsDialog, () => accountsDialogMachine)
  .addHandlers(accountEvents)
  .addHandlers(accountDialogEvents)
  .addHandlers(networkEvents)
  .setup();

export const { StoreProvider } = store;
