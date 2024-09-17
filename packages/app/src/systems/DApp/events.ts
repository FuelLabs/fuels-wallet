import { Services } from '~/store';
import type { Store } from '~/store';

import type { TxInputs } from '../Transaction/services';

import type {
  AddAssetInputs,
  ConnectRequestInputs,
  SelectNetworkInputs,
  SignInputs,
} from './machines';

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
    requestSelectNetwork(input: SelectNetworkInputs['start']) {
      return store.send(Services.selectNetworkRequest, {
        type: 'START',
        input,
      });
    },
  };
}
