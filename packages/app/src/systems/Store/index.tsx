import { createStore } from '@fuels/react-xstore';

import { accountEvents } from '../Account/events';
import { accountsMachine } from '../Account/machines';
import { assetEvents, assetsMachine } from '../Asset';
import { consolidateCoinsEvents } from '../ConsolidateCoins/events';
import { consolidateCoinsMachine } from '../ConsolidateCoins/machines/consolidateCoinsMachine';
import {
  addAssetRequestMachine,
  connectRequestMachine,
  messageRequestMachine,
  selectNetworkRequestMachine,
  transactionRequestMachine,
} from '../DApp';
import { requestEvents } from '../DApp/events';
import { reportErrorMachine } from '../Error';
import { networkEvents } from '../Network/events';
import { networksMachine } from '../Network/machines';
import { overlayMachine } from '../Overlay';
import { overlayEvents } from '../Overlay/events';
import { unlockMachine } from '../Unlock';
import { unlockEvents } from '../Unlock/events';

import { contractsMachine } from '../Contract/machines/contractsMachine';
import { nameSystemRequestMachine } from '../NameSystem/machines/nameSystemRequetMachine';
import type { StoreMachines } from './types';
import { Services } from './types';

export * from './types';

export const store$ = createStore<StoreMachines>({
  id: 'fuelStore',
});

export const store = store$
  .addMachine(Services.overlay, () => overlayMachine)
  .addMachine(Services.accounts, () => accountsMachine)
  .addMachine(Services.networks, () => networksMachine)
  .addMachine(Services.assets, () => assetsMachine)
  .addMachine(Services.contracts, () => contractsMachine)
  .addMachine(Services.unlock, () => unlockMachine)
  .addMachine(Services.msgRequest, () => messageRequestMachine)
  .addMachine(Services.connectRequest, () => connectRequestMachine)
  .addMachine(Services.txRequest, () => transactionRequestMachine)
  .addMachine(Services.addAssetRequest, () => addAssetRequestMachine)
  .addMachine(Services.reportError, () => reportErrorMachine)
  .addMachine(Services.selectNetworkRequest, () => selectNetworkRequestMachine)
  .addMachine(Services.nameSystemRequest, () => nameSystemRequestMachine)
  .addMachine(Services.consolidateCoins, () => consolidateCoinsMachine)
  .addHandlers(accountEvents)
  .addHandlers(networkEvents)
  .addHandlers(assetEvents)
  .addHandlers(overlayEvents)
  .addHandlers(unlockEvents)
  .addHandlers(requestEvents)
  .addHandlers(consolidateCoinsEvents)
  .setup();

export const { StoreProvider } = store;
