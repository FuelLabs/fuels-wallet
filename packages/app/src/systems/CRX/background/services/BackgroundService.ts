import {
  BACKGROUND_SCRIPT_NAME,
  CONTENT_SCRIPT_NAME,
  MessageTypes,
} from '@fuel-wallet/types';
import type { CommunicationEventArg, Connection } from '@fuel-wallet/types';
import { Address, type Network } from 'fuels';
import type {
  JSONRPCParams,
  JSONRPCRequest,
  JSONRPCServerMiddlewareNext,
  SimpleJSONRPCMethod,
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

type Methods<T> = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export class BackgroundService {
  readonly server: JSONRPCServer<EventOrigin>;
  readonly communicationProtocol: CommunicationProtocol;
  readonly methods: Array<Methods<Omit<BackgroundService, 'methods'>>> = [
    'ping',
    'version',
    'isConnected',
    'accounts',
    'connect',
    'network',
    'networks',
    'disconnect',
    'signMessage',
    'sendTransaction',
    'currentAccount',
    'addAssets',
    'assets',
    'selectNetwork',
    'addNetwork',
    'addAbi',
    'getAbi',
  ];

  constructor(communicationProtocol: CommunicationProtocol) {
    // Bind methods to ensure correct `this` context
    this.handleRequest = this.handleRequest.bind(this);
    this.connectionMiddleware = this.connectionMiddleware.bind(this);

    this.communicationProtocol = communicationProtocol;
    this.server = new JSONRPCServer<EventOrigin>();
    this.server.applyMiddleware(this.connectionMiddleware);
    this.setupListeners();
    this.addExternalMethods();
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new BackgroundService(communicationProtocol);
  }

  private async handleRequest(
    event: CommunicationEventArg<MessageTypes.request>
  ) {
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
  }

  setupListeners() {
    this.communicationProtocol.on(MessageTypes.request, this.handleRequest);
  }

  private addExternalMethods() {
    for (const methodName of this.methods) {
      this.server.addMethod(
        methodName,
        this[methodName].bind(this) as SimpleJSONRPCMethod<unknown>
      );
    }
  }

  private removeExternalMethods() {
    for (const methodName of this.methods) {
      this.server.removeMethod(methodName);
    }
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
      popupService.destroy();
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
    popupService.destroy();
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

    const { address, provider, transaction } = input;

    const popupService = await PopUpService.open(
      origin,
      Pages.requestTransaction(),
      this.communicationProtocol
    );

    // We need to forward bech32 addresses to the popup, regardless if we receive a b256 here
    // our database is storing fuel addresses
    const bech32Address = Address.fromDynamicInput(address).toString();

    const signedMessage = await popupService.sendTransaction({
      address: bech32Address,
      provider,
      transaction,
      origin,
      title,
      favIconUrl,
    });
    popupService.destroy();
    return signedMessage;
  }

  async currentAccount(_: unknown, serverParams: EventOrigin) {
    const currentAccount = await AccountService.getCurrentAccount();

    await this.requireConnection(serverParams.connection);

    const connectedAccounts = serverParams?.connection?.accounts || [];
    const hasAccessToAddress = connectedAccounts.includes(
      Address.fromString(currentAccount?.address || '0x00').toString()
    );

    if (hasAccessToAddress) return currentAccount?.address;

    const accounts = await AccountService.getAccounts();
    const firstConnectedAccount = accounts?.find((acc) =>
      connectedAccounts.includes(Address.fromString(acc.address).toString())
    );
    return firstConnectedAccount?.address;
  }

  async network(): Promise<Network> {
    const selectedNetwork = await NetworkService.getSelectedNetwork();

    if (!selectedNetwork) {
      throw new Error('Current network not found');
    }

    return {
      chainId: selectedNetwork.chainId,
      url: selectedNetwork.url,
    };
  }

  async networks(): Promise<Network[]> {
    const networks = await NetworkService.getNetworks();
    return networks.map((network) => {
      return {
        chainId: network.chainId,
        url: network.url,
      };
    });
  }

  async assets(_: JSONRPCParams) {
    const assets = await AssetService.getAssets();

    return assets || [];
  }

  async addAssets(
    input: MessageInputs['addAssets'],
    serverParams: EventOrigin
  ) {
    const assetsToAdd = await AssetService.validateAddAssets(input.assets);

    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;

    if (!assetsToAdd?.length) {
      throw new Error('No assets to add');
    }

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
    popupService.destroy();

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

  async selectNetwork(
    input: MessageInputs['selectNetwork'],
    serverParams: EventOrigin
  ): Promise<boolean> {
    // If network is already selected, we don't need to open the popup
    const { isSelected, popup, network, currentNetwork } =
      await NetworkService.validateNetworkSelect(input.network);
    if (isSelected) {
      return true;
    }

    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;

    const popupService = await PopUpService.open(
      origin,
      Pages.requestSelectNetwork(),
      this.communicationProtocol
    );

    await popupService.selectNetwork({
      network,
      currentNetwork,
      popup,
      origin,
      title,
      favIconUrl,
    });

    return true;
  }

  async addNetwork(
    input: MessageInputs['addNetwork'],
    serverParams: EventOrigin
  ): Promise<boolean> {
    await NetworkService.validateNetworkExists(input.network);
    const { isSelected, network } = await NetworkService.validateNetworkSelect({
      chainId: input.network.chainId,
      url: input.network.url,
    });
    if (isSelected) {
      return true;
    }

    const origin = serverParams.origin;
    const title = serverParams.title;
    const favIconUrl = serverParams.favIconUrl;

    const popupService = await PopUpService.open(
      origin,
      Pages.requestSelectNetwork(),
      this.communicationProtocol
    );

    await popupService.addNetwork({
      network,
      popup: 'add',
      origin,
      title,
      favIconUrl,
    });
    popupService.destroy();

    return true;
  }

  stop() {
    if (this.handleRequest) {
      this.communicationProtocol.removeListener(
        MessageTypes.request,
        this.handleRequest
      );
    }
    this.removeExternalMethods();
    PopUpService.destroyAll();
  }
}
