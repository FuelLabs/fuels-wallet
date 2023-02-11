import type { StoreClass } from '@fuel-wallet/xstore';

import type { TxInputs } from '../Transaction/services';

import type { SignInputs } from './machines';

import type { StoreMachines } from '~/store';
import { Services } from '~/store';

export function requestEvents(store: StoreClass<StoreMachines>) {
  return {
    requestTransaction(input: TxInputs['request']) {
      return store.send(Services.txRequest, {
        type: 'START',
        input,
      });
    },
    requestMessage(input: SignInputs['startSign']) {
      return store.send(Services.msgRequest, {
        type: 'START',
        input,
      });
    },
    requestConnection(input: string) {
      return store.send(Services.connectRequest, {
        type: 'START',
        input,
      });
    },
  };
}
