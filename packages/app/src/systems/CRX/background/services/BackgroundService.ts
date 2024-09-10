import { BACKGROUND_SCRIPT_NAME } from '@fuel-wallet/types';
import type { Connection } from '@fuel-wallet/types';
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuels/connectors';
import { Address } from 'fuels';
import type {
  JSONRPCParams,
  JSONRPCRequest,
  JSONRPCServerMiddlewareNext,
} from 'json-rpc-2.0';
import { JSONRPCServer } from 'json-rpc-2.0';
import { APP_VERSION } from '~/config';
import { AccountService } from '~/systems/Account/services';
import { AssetService } from '~/systems/Asset/services';
import { Pages } from '~/systems/Core/types';
import { ConnectionService } from '~/systems/DApp/services';
import { NetworkService } from '~/systems/Network/services';
import { AbiService } from '~/systems/Settings/services';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { PopUpService } from './PopUpService';
import type { MessageInputs } from './types';

type EventOrigin = {
  origin: string;
  title: string;
  favIconUrl: string;
  connection?: Connection;
};

export class BackgroundService {
  readonly server: JSONRPCServer<EventOrigin>;
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.server = new JSONRPCServer<EventOrigin>();
    this.server.applyMiddleware(this.connectionMiddleware.bind(this));
    this.setupListeners();
    this.externalMethods([
      this.ping,
      this.version,
      this.isConnected,
      this.accounts,
      this.connect,
      this.network,
      this.disconnect,
      this.signMessage,
      this.sendTransaction,
      this.currentAccount,
      this.addAssets,
      this.assets,
      this.addNetwork,
      this.addAbi,
      this.getAbi,
    ]);
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new BackgroundService(communicationProtocol);
  }

  setupListeners() {
    this.communicationProtocol.on(MessageTypes.request, async (event) => {
      if (event.target !== BACKGROUND_SCRIPT_NAME) return;
      const origin = event.sender?.origin!;
      const title = event.sender?.tab?.title!;
      const favIconUrl = event.sender?.tab?.favIconUrl!;
      const response = await this.server.receive(event.request, {
        origin,
        title,
        favIconUrl,
      });
      if (response) {
        this.communicationProtocol.postMessage({
          id: event.id,
          type: MessageTypes.response,
          target: CONTENT_SCRIPT_NAME,
          response,
        });
      }
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  externalMethods(methods: Array<string | any>) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    methods.forEach((method) => {
      let methodName = method;
      if (method.name) {
        methodName = method.name;
      }
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      this.server.addMethod(methodName, this[methodName].bind(this) as any);
    });
  }

  async requireAccounts() {
    const accounts = await AccountService.getAccounts();
    if (accounts.length === 0) {
      throw new Error('Unable to establish a connection. No accounts found');
    }
  }

  async requireAccountConnection(
    connection: Connection | undefined,
    address?: string
  ) {
    if (!connection) {
      throw new Error('connection not found');
    }
    const hasAccessToAddress = connection.accounts.includes(
      Address.fromString(address || '0x00').toString()
    );
    if (!hasAccessToAddress) {
      throw new Error('address is not authorized for this connection.');
    }
  }

  async requireConnection(connection?: Connection) {
    const isConnected = (connection?.accounts || []).length > 0;
    if (!isConnected) {
      throw new Error(
        'Connection not established. Please call connect() first to request a connection'
      );
    }
  }

  async connectionMiddleware(
    next: JSONRPCServerMiddlewareNext<EventOrigin>,
    request: JSONRPCRequest,
    serverParams: EventOrigin
  ) {
    const ALLOWED_METHODS = ['version', 'ping'];

    // If the method is ping, bypass checks
    if (ALLOWED_METHODS.includes(request.method)) {
      return next(request, serverParams);
    }

    // Retrieve connection for use on accounts
    const connection = await ConnectionService.getConnection(
      serverParams?.origin
    );

    // If the method is not `connect` or `isConnected`
    // check if connection is already established
    if (!['connect', 'isConnected'].includes(request.method)) {
      await this.requireConnection(connection);
    } else {
      await this.requireAccounts();
    }
    return next(request, {
      connection,
      ...serverParams,
    });
  }

  async sendEvent<T>(origin: string, eventName: string, params: T[]) {
    this.communicationProtocol.broadcast(origin, {
      target: CONTENT_SCRIPT_NAME,
      type: MessageTypes.event,
      events: [
        {
          event: eventName,
          params,
        },
      ],
    });
  }

  /**
   * JSON RPC Methods
   */
  async version() {
    return APP_VERSION;
  }

  async ping() {
    return true;
  }

  async isConnected(_: unknown, serverParams: EventOrigin) {
    return !!serverParams.connection;
  }

  async connect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;

    let authorizedApp = await ConnectionService.getConnection(origin);
    const accounts = await AccountService.getAccounts();
    const shownAccounts = accounts?.filter((acc) => !acc.isHidden);

    if (
      !authorizedApp ||
      (authorizedApp?.accounts.length || 0) !== shownAccounts.length
    ) {
      const popupService = await PopUpService.open(
        origin,
        Pages.requestConnection(),
        this.communicationProtocol
      );
      authorizedApp = await popupService.requestConnection({
        origin,
        title,
        favIconUrl,
        totalAccounts: shownAccounts?.length || 0,
      });
    }

    if (authorizedApp) {
      this.sendEvent(origin, 'connection', [!!authorizedApp]);
    }

    return !!authorizedApp;
  }

  async disconnect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    if (origin) {
      await ConnectionService.removeConnection({ origin });
      this.sendEvent(origin, 'connection', [false]);
      return true;
    }

    return false;
  }

  async accounts(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    if (origin) {
      const app = await ConnectionService.getConnection(origin);
      return app?.accounts || [];
    }

    return [];
  }

  async signMessage(
    input: Exclude<MessageInputs['signMessage'], 'origin'>,
    serverParams: EventOrigin
  ) {
    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;

    await this.requireAccountConnection(serverParams.connection, input.address);

    const popupService = await PopUpService.open(
      origin,
      Pages.requestMessage(),
      this.communicationProtocol
    );
    const signedMessage = await popupService.signMessage({
      ...input,
      origin,
      title,
      favIconUrl,
    });
    return signedMessage;
  }

  async sendTransaction(
    input: Exclude<MessageInputs['sendTransaction'], 'origin'>,
    serverParams: EventOrigin
  ) {
    await this.requireAccountConnection(serverParams.connection, input.address);
    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;
    const selectedNetwork = await NetworkService.getSelectedNetwork();

    if (selectedNetwork?.url !== input.provider.url) {
      throw new Error(
        [
          `${input.provider.url} is different from the user current network!`,
          'Request the user to add the new network. fuel.addNetwork([...]).',
        ].join('\n')
      );
    }

    const popupService = await PopUpService.open(
      origin,
      Pages.requestTransaction(),
      this.communicationProtocol
    );
    const signedMessage = await popupService.sendTransaction({
      ...input,
      origin,
      title,
      favIconUrl,
    });
    return signedMessage;
  }

  async currentAccount(_: unknown, serverParams: EventOrigin) {
    const currentAccount = await AccountService.getCurrentAccount();

    await this.requireAccountConnection(
      serverParams.connection,
      currentAccount?.address
    );

    return currentAccount?.address;
  }

  async network() {
    const selectedNetwork = await NetworkService.getSelectedNetwork();
    return {
      url: selectedNetwork?.url,
    };
  }

  async assets(_: JSONRPCParams) {
    const assets = await AssetService.getAssets();

    return assets || [];
  }

  async addAssets(
    input: MessageInputs['addAssets'],
    serverParams: EventOrigin
  ) {
    const { assetsToAdd } = await AssetService.validateAddAssets(input.assets);

    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;

    const popupService = await PopUpService.open(
      origin,
      Pages.requestAddAssets(),
      this.communicationProtocol
    );
    await popupService.addAssets({
      assets: assetsToAdd,
      origin,
      title,
      favIconUrl,
    });

    return true;
  }

  async addAbi(input: MessageInputs['addAbi']) {
    await AbiService.addAbi({ data: input.abiMap });
    return true;
  }

  async getAbi(input: MessageInputs['getAbi']) {
    const abi = await AbiService.getAbi({ data: input.contractId });
    return abi;
  }

  async addNetwork(
    input: MessageInputs['addNetwork'],
    serverParams: EventOrigin
  ) {
    const { network } = input;

    const existingNetwork = await NetworkService.getNetworkByNameOrUrl(network);
    if (!existingNetwork) {
      await NetworkService.validateNetworkVersion({ data: network });
    }

    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;

    const popupService = await PopUpService.open(
      origin,
      Pages.requestAddNetwork(),
      this.communicationProtocol
    );

    await popupService.addNetwork({
      network: {
        ...network,
        id: existingNetwork?.id,
      },
      origin,
      title,
      favIconUrl,
    });

    return true;
  }
}
