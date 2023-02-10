import { createStore } from '@fuel-wallet/xstore';

import { accountMachine } from '../Account';
import { accountEvents } from '../Account/events';
import { assetEvents, assetsMachine } from '../Asset';
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
  .addMachine(Services.accounts, () => accountMachine)
  .addMachine(Services.networks, () => networksMachine)
  .addMachine(Services.assets, () => assetsMachine)
  .addHandlers(accountEvents)
  .addHandlers(networkEvents)
  .addHandlers(assetEvents)
  .setup();

export const { StoreProvider } = store;
