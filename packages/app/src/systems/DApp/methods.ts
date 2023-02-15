import { ExtensionPageConnection } from '@fuel-wallet/sdk';
import { transactionRequestify } from 'fuels';

import { IS_CRX } from '~/config';
import { Services, store } from '~/store';
import type { MessageInputs } from '~/systems/CRX/background/services/types';

// On external methods we need to wait for the state to be updated
// this can take time as the user can take a while to respond
// so we use a default timeout of 5 minutes
const WAIT_FOR_CONFIG = {
  timeout: 1000 * 60 * 5,
};

export class RequestMethods extends ExtensionPageConnection {
  constructor() {
    super();
    super.externalMethods([
      this.requestConnection,
      this.signMessage,
      this.sendTransaction,
    ]);
  }

  static start() {
    return new RequestMethods();
  }

  async requestConnection({ origin }: { origin: string }) {
    const state = await store
      .requestConnection(origin)
      .waitForState(Services.connectRequest, WAIT_FOR_CONFIG);
    return !!state.context.isConnected;
  }

  async signMessage(input: MessageInputs['signMessage']) {
    const state = await store
      .requestMessage(input)
      .waitForState(Services.msgRequest, WAIT_FOR_CONFIG);
    return state.context.signedMessage;
  }

  async sendTransaction(input: MessageInputs['sendTransaction']) {
    const { origin, address, provider, transaction } = input;
    const providerUrl = provider.url;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));
    const state = await store
      .requestTransaction({ origin, transactionRequest, address, providerUrl })
      .waitForState(Services.txRequest, {
        ...WAIT_FOR_CONFIG,
        done: 'txSuccess',
      });
    return state.context.response?.approvedTx?.id;
  }
}

if (IS_CRX) {
  RequestMethods.start();
}
