import { ExtensionPageConnection } from '@fuel-wallet/connections';
import type { FuelConnectorSendTxParams } from 'fuels';
import { transactionRequestify } from 'fuels';
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

type ExtendedSendTxParams = {
  // Include the original FuelConnectorSendTxParams properties
  skipCustomFee?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: Using TransactionRequest would require additional imports
  onBeforeSend?: (txRequest: unknown) => Promise<unknown>;

  // Add our custom properties
  origin: string;
  address: string;
  provider: {
    url: string;
    cache?: {
      consensusParameterTimestamp?: string;
      chain?: Record<string, unknown>; // Make sure 'chain' is included
      chainInfo?: Record<string, unknown>;
      nodeInfo?: Record<string, unknown>;
    };
  };
  transaction: string;
  title?: string;
  favIconUrl?: string;
  state?: {
    state?: 'funded' | 'immutable';
  };
  data?: {
    latestGasPrice?: string;
    estimatedGasPrice?: string;
    summary?: Record<string, unknown>;
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

  // Use our extended type instead of MessageInputs['sendTransaction']
  async sendTransaction(input: ExtendedSendTxParams) {
    console.log('🔄 WALLET: Received transaction with data:', input);
    const {
      origin,
      address,
      provider,
      transaction,
      title,
      favIconUrl,
      skipCustomFee,
      state: txState,
      data,
    } = input;
    const providerUrl = provider.url;
    const transactionRequest = transactionRequestify(JSON.parse(transaction));

    // Create the base transaction request object
    const requestObj = {
      origin,
      transactionRequest,
      address,
      providerUrl,
      title,
      favIconUrl,
      skipCustomFee,
    };

    // Create a complete object merging the base with enhanced data
    const enhancedRequestObj = {
      ...requestObj,
      // Only add these properties if they exist
      ...(txState && { state: txState }),
      ...(provider.cache && { providerCache: provider.cache }),
      ...(data && { transactionData: data }),
    };

    const txResponse = await store
      .requestTransaction(enhancedRequestObj)
      .waitForState(Services.txRequest, {
        ...WAIT_FOR_CONFIG,
        done: 'txSuccess',
      });
    return txResponse.context.response?.txSummaryExecuted?.id;
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
