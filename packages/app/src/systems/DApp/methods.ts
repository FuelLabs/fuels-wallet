import { ExtensionPageConnection } from '@fuel-wallet/connections';
import {
  type TransactionResponse,
  serializeProviderCache,
  transactionRequestify,
} from 'fuels';
import { IS_CRX } from '~/config';
import { Services, store } from '~/store';
import { AccountService } from '~/systems/Account/services/account';
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

// @TODO: REMOVE THIS METHOD WHEN UPDATES TO 0.100.5, AS WE HAVE IT ALREADY ON TS-SDK
export const serializeTransactionResponseJson = async (
  response: TransactionResponse
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const resp = { ...response } as any;
  const {
    id,
    status,
    abis,
    request,
    provider,
    gqlTransaction,
    preConfirmationStatus,
  } = resp;
  return {
    id,
    status,
    abis,
    requestJson: request ? JSON.stringify(request.toJSON()) : undefined,
    providerUrl: provider.url,
    providerCache: await serializeProviderCache(provider),
    gqlTransaction,
    preConfirmationStatus,
  };
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

    if (state.context.response?.txResponse) {
      try {
        return await serializeTransactionResponseJson(
          state.context.response.txResponse
        );
      } catch (error) {
        console.error('Error serializing transaction response:', error);
        return state.context.response.txResponse.id;
      }
    }

    return state.context.response?.txSummaryExecuted?.id;
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
