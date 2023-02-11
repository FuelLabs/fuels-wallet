import { createStore } from '@fuel-wallet/xstore';

import { accountEvents } from '../Account/events';
import { accountsMachine } from '../Account/machines';
import { assetEvents, assetsMachine } from '../Asset';
import { networkEvents } from '../Network/events';
import { networksMachine } from '../Network/machines';
import { overlayMachine } from '../Overlay';
import { overlayEvents } from '../Overlay/events';
import { unlockMachine } from '../Unlock';
import { unlockEvents } from '../Unlock/events';

import type { StoreMachines } from './types';
import { Services } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
  persistedStates: ['networks'],
});

export const store = store$
  .addMachine(Services.overlay, () => overlayMachine)
  .addMachine(Services.accounts, () => accountsMachine)
  .addMachine(Services.networks, () => networksMachine)
  .addMachine(Services.assets, () => assetsMachine)
  .addMachine(Services.unlock, () => unlockMachine)
  .addHandlers(accountEvents)
  .addHandlers(networkEvents)
  .addHandlers(assetEvents)
  .addHandlers(overlayEvents)
  .addHandlers(unlockEvents)
  .setup();

export const { StoreProvider } = store;
