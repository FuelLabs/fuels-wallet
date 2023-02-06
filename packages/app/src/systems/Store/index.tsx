import { createStore } from '@fuel-wallet/xstore';

import { accountMachine } from '../Account';
import { accountEvents } from '../Account/events';
import { networksMachine } from '../Network';
import { networkEvents } from '../Network/events';

import type { StoreMachines } from './types';
import { Services } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
});

export const store = store$
  .addMachine(Services.accounts, () => accountMachine)
  .addMachine(Services.networks, () => networksMachine)
  .addHandlers(accountEvents)
  .addHandlers(networkEvents)
  .setup();

export const { StoreProvider } = store;
