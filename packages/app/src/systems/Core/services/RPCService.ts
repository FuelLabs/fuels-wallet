/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKGROUND_SCRIPT_NAME, POPUP_SCRIPT_NAME } from '@fuels-wallet/sdk';
import { JSONRPCServer } from 'json-rpc-2.0';

import type { RequestMessage, ResponseMessage } from '~/systems/CRX/types';
import { EventTypes } from '~/systems/CRX/types';

export class RPCService {
  readonly server: JSONRPCServer;
  readonly connection: chrome.runtime.Port;

  constructor() {
    this.server = new JSONRPCServer();
    this.connection = chrome.runtime.connect(chrome.runtime.id, {
      name: BACKGROUND_SCRIPT_NAME,
    });
    this.setupListeners();
    this.ready();
  }

  setupMethods(target: any, methods: Array<string>) {
    methods.forEach((method) => {
      this.server.addMethod(method, target[method].bind(target) as any);
    });
  }

  ready() {
    this.connection.postMessage({
      target: BACKGROUND_SCRIPT_NAME,
      type: EventTypes.uiEvent,
      ready: true,
    });
  }

  setupListeners() {
    this.connection.onMessage.addListener(this.onMessage);
  }

  onMessage = (message: RequestMessage) => {
    if (message.target === POPUP_SCRIPT_NAME) {
      this.server.receive(message.request).then((response) => {
        if (response) {
          const responseMessage: ResponseMessage = {
            id: message.id,
            target: BACKGROUND_SCRIPT_NAME,
            type: EventTypes.response,
            response,
          };
          this.connection.postMessage(responseMessage);
        }
      });
    }
  };

  destroy() {
    this.connection.disconnect();
  }
}
