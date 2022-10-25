/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuels-wallet/sdk';
import type { JSONRPCParams } from 'json-rpc-2.0';
import { JSONRPCServer } from 'json-rpc-2.0';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { PopUpService } from './PopUpService';

import { ApplicationService } from '~/systems/AppConnect/services';

type EventOrigin = { origin: string };

export class BackgroundService {
  readonly server: JSONRPCServer<EventOrigin>;

  constructor(readonly communicationProtocol: CommunicationProtocol) {
    this.server = new JSONRPCServer<EventOrigin>();
    this.setupListeners();
    this.externalMethods([this.accounts, this.connect, this.disconnect]);
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new BackgroundService(communicationProtocol);
  }

  setupListeners() {
    this.communicationProtocol.on(MessageTypes.request, async (event) => {
      const response = await this.server.receive(event.request, {
        origin: event.sender!.origin!,
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

  async connect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;
    if (!origin) return false;

    let authorizedApp = await ApplicationService.getApplication(origin);
    if (authorizedApp) return true;

    const popupService = await PopUpService.open(
      origin,
      this.communicationProtocol
    );
    authorizedApp = await popupService.requestAuthorization(origin);
    return !!authorizedApp;
  }

  async disconnect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    if (origin) {
      await ApplicationService.removeApplication(origin);
      return true;
    }

    return false;
  }

  async accounts(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    if (origin) {
      const app = await ApplicationService.getApplication(origin);
      return app?.accounts || [];
    }

    return [];
  }
}
