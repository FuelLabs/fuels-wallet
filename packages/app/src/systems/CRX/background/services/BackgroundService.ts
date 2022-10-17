import { CONTENT_SCRIPT_NAME } from '@fuels-wallet/sdk';
import type { JSONRPCParams } from 'json-rpc-2.0';
import { JSONRPCServer } from 'json-rpc-2.0';

import { EventTypes } from '../../types';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { PopUpService } from './PopUpService';

import { ApplicationService } from '~/systems/Application/services';

type EventOrigin = { origin: string };

export class BackgroundService {
  readonly communicationProtocol: CommunicationProtocol;
  readonly server: JSONRPCServer<EventOrigin>;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.server = new JSONRPCServer<EventOrigin>();
    this.setupListeners();
    this.setupMethods(['accounts', 'connect', 'disconnect']);
  }

  setupListeners() {
    this.communicationProtocol.on(EventTypes.request, async (event) => {
      const response = await this.server.receive(event.request, {
        origin: event.sender!.origin!,
      });
      if (response) {
        this.communicationProtocol.postMessage({
          id: event.id,
          type: EventTypes.response,
          target: CONTENT_SCRIPT_NAME,
          response,
        });
      }
    });
  }

  setupMethods(methods: Array<string>) {
    methods.forEach((method) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.server.addMethod(method, this[method].bind(this) as any);
    });
  }

  async connect(_: JSONRPCParams, serverParams: EventOrigin) {
    const origin = serverParams.origin;

    if (origin) {
      const app = await ApplicationService.getApplication(origin);

      if (!app) {
        const popupService = await PopUpService.open(
          origin,
          this.communicationProtocol
        );
        const app = await popupService.requestAuthorization(origin);

        return !!app;
      }

      return !!app;
    }

    return false;
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
