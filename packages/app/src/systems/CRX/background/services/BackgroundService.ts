/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';
import type { Connection } from '@fuel-wallet/types';
import { Address } from 'fuels';
import type {
  JSONRPCParams,
  JSONRPCRequest,
  JSONRPCServerMiddlewareNext,
} from 'json-rpc-2.0';
import { JSONRPCServer } from 'json-rpc-2.0';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { PopUpService } from './PopUpService';
import type { MessageInputs } from './types';

import { AccountService } from '~/systems/Account/services';
import { Pages } from '~/systems/Core/types';
import { ConnectionService } from '~/systems/DApp/services';
import { NetworkService } from '~/systems/Network/services';

type EventOrigin = {
  origin: string;
  connection?: Connection;
};

export class BackgroundService {
  readonly server: JSONRPCServer<EventOrigin>;
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.server = new JSONRPCServer<EventOrigin>();
    this.server.applyMiddleware(this.connectionMiddlware.bind(this));
    this.setupListeners();
    this.externalMethods([
      this.isConnected,
      this.accounts,
      this.connect,
      this.network,
      this.disconnect,
      this.signMessage,
      this.sendTransaction,
      this.currentAccount,
    ]);
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new BackgroundService(communicationProtocol);
  }

  setupListeners() {
    this.communicationProtocol.on(MessageTypes.request, async (event) => {
      const origin = event.sender!.origin!;
      const response = await this.server.receive(event.request, {
        origin,
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

  externalMethods(methods: Array<string | any>) {
    methods.forEach((method) => {
      let methodName = method;
      if (method.name) {
        methodName = method.name;
      }
      this.server.addMethod(methodName, this[methodName].bind(this) as any);
    });
  }

  async requireAccounts() {
    const accounts = await AccountService.getAccounts();
    if (accounts.length === 0) {
      throw new Error('Unable to establish a connection. No accounts found');
    }
  }

  async requireAccountConnecton(
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
      throw new Error(`address is not authorized for this connection.`);
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

  async connectionMiddlware(
    next: JSONRPCServerMiddlewareNext<EventOrigin>,
    request: JSONRPCRequest,
    serverParams: EventOrigin
  ) {
    // Retrive connection for use on accounts
    const connection = await ConnectionService.getConnection(
      serverParams!.origin
    );

    // If the method is not connect or isConnected
    // check if connection is already established
    if (!['connect', 'isConnected'].includes(request.method)) {
      await this.requireConnection(connection);
    } else {
      await this.requireAccounts();
    }
    return next(request, {
      connection,
      origin: serverParams.origin,
    });
  }

  async sendEvent(origin: string, eventName: string, params: any[]) {
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
  async isConnected(_: unknown, serverParams: EventOrigin) {
    return !!serverParams.connection;
  }

  async connect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    let authorizedApp = await ConnectionService.getConnection(origin);

    if (!authorizedApp) {
      const popupService = await PopUpService.open(
        origin,
        Pages.requestConnection(),
        this.communicationProtocol
      );
      authorizedApp = await popupService.requestConnection({ origin });
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

    await this.requireAccountConnecton(serverParams.connection, input.address);

    const popupService = await PopUpService.open(
      origin,
      Pages.requestMessage(),
      this.communicationProtocol
    );
    const signedMessage = await popupService.signMessage({
      ...input,
      origin,
    });
    return signedMessage;
  }

  async sendTransaction(
    input: Exclude<MessageInputs['sendTransaction'], 'origin'>,
    serverParams: EventOrigin
  ) {
    await this.requireAccountConnecton(serverParams.connection, input.address);
    const origin = serverParams.origin;
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
    });
    return signedMessage;
  }

  async currentAccount(_: unknown, serverParams: EventOrigin) {
    const currentAccount = await AccountService.getCurrentAccount();

    await this.requireAccountConnecton(
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
}
