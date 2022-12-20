/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';
import type { FuelWeb3ProviderConfig } from '@fuel-wallet/types';
import type {
  JSONRPCParams,
  JSONRPCRequest,
  JSONRPCServerMiddlewareNext,
} from 'json-rpc-2.0';
import { JSONRPCServer } from 'json-rpc-2.0';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { PopUpService } from './PopUpService';

import { AccountService } from '~/systems/Account/services';
import { Pages } from '~/systems/Core/types';
import { ConnectionService } from '~/systems/DApp/services';

type EventOrigin = { origin: string };

export class BackgroundService {
  readonly server: JSONRPCServer<EventOrigin>;
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.server = new JSONRPCServer<EventOrigin>();
    this.server.applyMiddleware(this.connectionMiddlware.bind(this));
    this.setupListeners();
    this.externalMethods([
      this.accounts,
      this.connect,
      this.disconnect,
      this.signMessage,
      this.sendTransaction,
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

  async requireConnection(origin: string) {
    const authorizedApp = await ConnectionService.getConnection(origin);
    if (!authorizedApp) {
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
    // If the method is not connect check if connection is already established
    if (request.method !== 'connect') {
      await this.requireConnection(serverParams!.origin);
    } else {
      await this.requireAccounts();
    }
    return next(request, serverParams);
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

  async connect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    let authorizedApp = await ConnectionService.getConnection(origin);

    if (!authorizedApp) {
      const popupService = await PopUpService.open(
        origin,
        Pages.requestConnection(),
        this.communicationProtocol
      );
      authorizedApp = await popupService.requestConnection(origin);
    }

    if (authorizedApp) {
      this.sendEvent(origin, 'connection', [!!authorizedApp]);
    }

    return !!authorizedApp;
  }

  async disconnect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    if (origin) {
      await ConnectionService.removeConnection(origin);
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
    { message }: { message: string },
    serverParams: EventOrigin
  ) {
    const origin = serverParams.origin;

    const popupService = await PopUpService.open(
      origin,
      Pages.requestMessage(),
      this.communicationProtocol
    );
    const signedMessage = await popupService.signMessage(origin, message);
    return signedMessage;
  }

  async sendTransaction(
    {
      provider,
      transaction,
    }: { provider: FuelWeb3ProviderConfig; transaction: string },
    serverParams: EventOrigin
  ) {
    const origin = serverParams.origin;

    const popupService = await PopUpService.open(
      origin,
      Pages.requestTransaction(),
      this.communicationProtocol
    );
    const signedMessage = await popupService.sendTransaction(
      origin,
      provider,
      transaction
    );
    return signedMessage;
  }
}
