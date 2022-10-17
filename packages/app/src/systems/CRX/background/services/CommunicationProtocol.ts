import { BACKGROUND_SCRIPT_NAME, createUUID } from '@fuels-wallet/sdk';
import EventEmitter from 'events';

import type {
  CommunicationMessage,
  CommunicationPostMessage,
} from '../../types';
import { EventTypes } from '../../types';

export class CommunicationProtocol extends EventEmitter {
  id: string;
  ports: Map<string, chrome.runtime.Port>;

  constructor() {
    super();
    this.id = createUUID();
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
      this.emit(EventTypes.removeConnection, id);
    }
  };

  postMessage = (message: CommunicationPostMessage) => {
    const port = this.ports.get(message.id);
    if (port) {
      port.postMessage(message);
    }
  };

  broadcast = (origin: string, message: CommunicationMessage) => {
    this.ports.forEach((port) => {
      if (port.sender?.origin === origin) {
        port.postMessage(message);
      }
    });
  };

  getPortId = (port: chrome.runtime.Port) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of this.ports.entries()) {
      if (value === port) {
        return key;
      }
    }
    return null;
  };

  onMessage = (message: CommunicationMessage, port: chrome.runtime.Port) => {
    const sender = port.sender;
    if (sender?.id !== chrome.runtime.id) return;
    if (message.target !== BACKGROUND_SCRIPT_NAME) return;
    if (!Object.keys(EventTypes).includes(message.type)) return;

    const portId = this.getPortId(port);

    this.emit(
      message.type,
      Object.freeze({
        id: portId,
        message,
        sender: port.sender,
      })
    );
  };

  destroy() {
    this.ports.forEach((port) => port.disconnect());
    this.ports.clear();
  }
}
