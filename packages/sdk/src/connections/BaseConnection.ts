/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import EventEmitter from 'events';
import type { JSONRPCRequest, JSONRPCResponse } from 'json-rpc-2.0';
import { JSONRPCServer, JSONRPCClient } from 'json-rpc-2.0';

import type {
  CommunicationMessage,
  EventMessage,
  RequestMessage,
  ResponseMessage,
  UIEventMessage,
} from '../types';
import { MessageTypes } from '../types';

export class BaseConnection extends EventEmitter {
  readonly client: JSONRPCClient;
  readonly server: JSONRPCServer;

  constructor() {
    super();
    this.client = new JSONRPCClient(this.sendRequest.bind(this));
    this.server = new JSONRPCServer();
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

  async sendRequest(request: JSONRPCRequest | null): Promise<void> {
    throw new Error('Send request not implemented');
  }

  sendResponse(
    response: JSONRPCResponse | null,
    message: RequestMessage
  ): void {
    throw new Error('Send response not implemented');
  }

  onCommunicationMessage = (message: CommunicationMessage) => {
    switch (message.type) {
      case MessageTypes.response:
        this.onResponse(message);
        break;
      case MessageTypes.request:
        this.onRequest(message);
        break;
      case MessageTypes.event:
        this.onEvent(message);
        break;
      case MessageTypes.uiEvent:
        this.onUIEvent(message);
        break;
      default:
    }
  };

  onEvent(message: EventMessage): void {
    message.events.forEach((eventData) => {
      this.emit(eventData.event, ...eventData.params);
    });
  }

  onResponse(message: ResponseMessage): void {
    this.client.receive(message.response);
  }

  onRequest(message: RequestMessage): void {
    this.server.receive(message.request).then((response) => {
      this.sendResponse(response, message);
    });
  }

  onUIEvent(message: UIEventMessage): void {}
}
