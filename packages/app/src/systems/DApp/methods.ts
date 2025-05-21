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
    this.signTransaction,
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
    console.log(
      '[DApp/methods] sendTransaction (called by PopUpService) with input:',
      {
        address: input.address,
        hasProvider: !!input.provider,
        providerUrl: input.provider?.url,
        noSendReturnPayload: input.noSendReturnPayload,
        returnTransactionResponse: input.returnTransactionResponse,
      }
    );

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
      noSendReturnPayload,
    } = input;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));

    console.log('[DApp/methods] Parsed transaction request for machine');

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
        noSendReturnPayload: input.noSendReturnPayload,
      })
      .waitForState(Services.txRequest, {
        ...WAIT_FOR_CONFIG,
        done: 'txSuccess',
      });

    console.log(
      '[DApp/methods] Transaction machine has reached txSuccess. Context response:',
      state.context.response
    );
    console.log('[DApp/methods] Machine state details:', {
      hasSignedTransactionInContext:
        !!state.context.response?.signedTransaction,
      signatureLengthInContext:
        state.context.response?.signedTransaction?.length,
      actualSignedTransactionInContext:
        state.context.response?.signedTransaction,
      txResponseInContext: state.context.response?.txResponse,
      noSendReturnPayloadFromInput: noSendReturnPayload,
      returnTransactionResponseFromInput: returnTransactionResponse,
    });

    if (noSendReturnPayload) {
      console.log(
        '[DApp/methods] noSendReturnPayload is true. Returning signedTransaction from context:',
        state.context.response?.signedTransaction
      );
      return state.context.response?.signedTransaction;
    }

    const txId =
      state.context.response?.txResponse?.id ||
      state.context.response?.txSummaryExecuted?.id;

    if (!returnTransactionResponse) {
      console.log(
        '[DApp/methods] returnTransactionResponse is false. Returning txId:',
        txId
      );
      return txId;
    }

    if (state.context.response?.txResponse) {
      try {
        const serializedTxResponse = await serializeTransactionResponseJson(
          state.context.response.txResponse
        );
        console.log(
          '[DApp/methods] returnTransactionResponse is true. Returning serializedTxResponse.'
        );
        return serializedTxResponse;
      } catch (error) {
        console.error(
          '[DApp/methods] Error serializing transaction response:',
          error
        );
      }
    }

    console.log('[DApp/methods] Fallback. Returning txId:', txId);
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

  async signTransaction(input: MessageInputs['signTransaction']) {
    console.log('[DApp/methods] signTransaction called with:', {
      address: input.address,
      hasProvider: !!input.provider,
      providerUrl: input.provider?.url,
    });

    const { address, provider, transaction, origin, title, favIconUrl } = input;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));

    console.log('[DApp/methods] Parsed transaction request');

    const state = await store
      .requestTransaction({
        origin,
        transactionRequest,
        address,
        providerConfig: provider,
        title,
        favIconUrl,
        skipCustomFee: true,
        noSendReturnPayload: true,
      })
      .waitForState(Services.txRequest, {
        ...WAIT_FOR_CONFIG,
        done: 'txSuccess',
      });

    console.log('[DApp/methods] Transaction machine state:', {
      hasSignedTransaction: !!state.context.response?.signedTransaction,
      signatureLength: state.context.response?.signedTransaction?.length,
    });

    return state.context.response?.signedTransaction;
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
