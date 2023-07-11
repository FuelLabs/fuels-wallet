import type { TxInputs } from '../Transaction/services';

import type {
  AddAssetInputs,
  AddNetworkInputs,
  ConnectRequestInputs,
  SignInputs,
} from './machines';

import { Services } from '~/store';
import type { Store } from '~/store';

export function requestEvents(store: Store) {
  return {
    requestTransaction(input: TxInputs['request']) {
      return store.send(Services.txRequest, {
        type: 'START',
        input,
      });
    },
    requestMessage(input: SignInputs['start']) {
      return store.send(Services.msgRequest, {
        type: 'START',
        input,
      });
    },
    requestConnection(input: ConnectRequestInputs['start']) {
      return store.send(Services.connectRequest, {
        type: 'START',
        input,
      });
    },
    requestAddAsset(input: AddAssetInputs['start']) {
      return store.send(Services.addAssetRequest, {
        type: 'START',
        input,
      });
    },
    requestAddNetwork(input: AddNetworkInputs['start']) {
      return store.send(Services.addNetworkRequest, {
        type: 'START',
        input,
      });
    },
  };
}
