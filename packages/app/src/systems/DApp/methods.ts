import { ExtensionPageConnection } from '@fuel-wallet/connections';
import { serializeTransactionResponseJson, transactionRequestify } from 'fuels';
import { IS_CRX } from '~/config';
import { Services, store } from '~/store';
import type {
  MessageInputs,
  PopUpServiceInputs,
} from '~/systems/CRX/background/services/types';
import { listenToGlobalErrors } from '~/systems/Core/utils/listenToGlobalErrors';

// On external methods we need to wait for the state to be updated
// this can take time as the user can take a while to respond
// so we use a default timeout of 5 minutes
const WAIT_FOR_CONFIG = {
  timeout: 1000 * 60 * 5,
};

export class RequestMethods extends ExtensionPageConnection {
  readonly methods = [
    this.requestConnection,
    this.signMessage,
    this.sendTransaction,
    this.addAssets,
    this.selectNetwork,
    this.addNetwork,
  ];
  constructor() {
    super();
    super.externalMethods(this.methods);
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
    const {
      address,
      provider,
      transaction,
      origin,
      title,
      favIconUrl,
      skipCustomFee,
      transactionState,
      transactionSummary,
      returnTransactionResponse,
    } = input;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));

    const state = await store
      .requestTransaction({
        origin,
        transactionRequest,
        address,
        providerConfig: provider,
        title,
        favIconUrl,
        skipCustomFee,
        transactionState,
        transactionSummary,
      })
      .waitForState(Services.txRequest, {
        ...WAIT_FOR_CONFIG,
        done: 'txSuccess',
      });

    const txId =
      state.context.response?.txResponse?.id ||
      state.context.response?.txSummaryExecuted?.id;

    if (!returnTransactionResponse) {
      // it will be always txResponse, but just for safety we check both
      return txId;
    }

    if (state.context.response?.txResponse) {
      try {
        const serializedTxResponse = await serializeTransactionResponseJson(
          state.context.response.txResponse
        );
        return serializedTxResponse;
      } catch (error) {
        console.error('Error serializing transaction response:', error);
      }
    }

    return txId;
  }

  async addAssets(input: MessageInputs['addAssets']) {
    await store
      .requestAddAsset(input)
      .waitForState(Services.addAssetRequest, WAIT_FOR_CONFIG);
    return true;
  }

  async selectNetwork(input: PopUpServiceInputs['selectNetwork']) {
    await store
      .requestSelectNetwork(input)
      .waitForState(Services.selectNetworkRequest, WAIT_FOR_CONFIG);
    return true;
  }

  async addNetwork(input: PopUpServiceInputs['addNetwork']) {
    await store
      .requestSelectNetwork(input)
      .waitForState(Services.selectNetworkRequest, WAIT_FOR_CONFIG);
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
