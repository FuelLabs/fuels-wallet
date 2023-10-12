import { BaseConnection, createUUID } from '@fuel-wallet/sdk';
import type {
  CommunicationEventArg,
  CommunicationMessage,
  EventMessage,
} from '@fuel-wallet/types';
import {
  VAULT_SCRIPT_NAME,
  BACKGROUND_SCRIPT_NAME,
  MessageTypes,
} from '@fuel-wallet/types';

export class CommunicationProtocol extends BaseConnection {
  ports: Map<string, chrome.runtime.Port>;

  constructor() {
    super();
    this.ports = new Map();
  }

  addConnection(port: chrome.runtime.Port) {
    const id = createUUID();
    this.ports.set(id, port);
    this.setupListeners(id);
  }

  setupListeners(id: string) {
    const port = this.ports.get(id);
    if (port && !port.onMessage.hasListener(this.onMessage)) {
      port.onMessage.addListener(this.onMessage);
      port.onDisconnect.addListener(() => this.removePort(id));
    }
  }

  removePort = (id: string) => {
    const port = this.ports.get(id);
    if (port) {
      port.onMessage.removeListener(this.onMessage);
      this.ports.delete(id);
      this.emit(MessageTypes.removeConnection, id);
    }
  };

  postMessage = (message: CommunicationMessage) => {
    const port = this.ports.get(message.id!);
    if (port) {
      port.postMessage(message);
    }
  };

  broadcast = (origins: Array<string> | string, message: EventMessage) => {
    const originList = Array.isArray(origins) ? origins : [origins];
    this.ports.forEach((port) => {
      if (originList.includes(port.sender?.origin || '')) {
        port.postMessage(message);
      }
    });
  };

  getPortId = (port: chrome.runtime.Port) => {
    for (const [key, value] of this.ports.entries()) {
      if (value === port) {
        return key;
      }
    }
    return null;
  };

  on<E extends MessageTypes>(
    eventName: E,
    listener: (message: CommunicationEventArg<E>) => void,
  ) {
    return super.on(eventName, listener);
  }

  onMessage = (message: CommunicationMessage, port: chrome.runtime.Port) => {
    const sender = port.sender;
    if (sender?.id !== chrome.runtime.id) return;
    if (![VAULT_SCRIPT_NAME, BACKGROUND_SCRIPT_NAME].includes(message.target))
      return;
    if (!Object.keys(MessageTypes).includes(message.type)) return;

    const portId = this.getPortId(port);

    this.emit(
      message.type,
      Object.freeze({
        ...message,
        id: portId,
        sender: port.sender,
      }),
    );
  };

  destroy() {
    this.ports.forEach((port) => port.disconnect());
    this.ports.clear();
  }
}
