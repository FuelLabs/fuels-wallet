import { ExtensionPageConnection } from '@fuel-wallet/connections';
import { transactionRequestify } from 'fuels';
import { IS_CRX } from '~/config';
import { Services, store } from '~/store';
import type { MessageInputs } from '~/systems/CRX/background/services/types';
import { listenToGlobalErrors } from '~/systems/Core/utils/listenToGlobalErrors';

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
      this.addAssets,
      this.addNetwork,
    ]);
  }

  static start() {
    return new RequestMethods();
  }

  async requestConnection(input: MessageInputs['requestConnection']) {
    const state = await store
      .requestConnection(input)
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
    const { origin, address, provider, transaction, title, favIconUrl } = input;
    const providerUrl = provider.url;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));
    const state = await store
      .requestTransaction({
        origin,
        transactionRequest,
        address,
        providerUrl,
        title,
        favIconUrl,
      })
      .waitForState(Services.txRequest, {
        ...WAIT_FOR_CONFIG,
        done: 'txSuccess',
      });
    return state.context.response?.txSummaryExecuted?.id;
  }

  async addAssets(input: MessageInputs['addAssets']) {
    await store
      .requestAddAsset(input)
      .waitForState(Services.addAssetRequest, WAIT_FOR_CONFIG);
    return true;
  }

  async addNetwork(input: MessageInputs['addNetwork']) {
    await store
      .requestAddNetwork(input)
      .waitForState(Services.addNetworkRequest, WAIT_FOR_CONFIG);
    return true;
  }
}

if (IS_CRX) {
  RequestMethods.start();
}

listenToGlobalErrors((error) => {
  store.send(Services.reportError, {
    type: 'SAVE_ERROR',
    input: error,
  });
});
