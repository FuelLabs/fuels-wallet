import { BaseConnection, createUUID } from '@fuel-wallet/connections';
import type { CommunicationEventArg } from '@fuel-wallet/types';
import { BACKGROUND_SCRIPT_NAME, VAULT_SCRIPT_NAME } from '@fuel-wallet/types';
import {
  type CommunicationMessage,
  type EventMessage,
  MessageTypes,
} from '@fuels/connectors';

export class CommunicationProtocol extends BaseConnection {
  ports: Map<string, chrome.runtime.Port>;
  portsDisconnectionHandlers: Map<string, () => void>;

  constructor() {
    super();
    this.ports = new Map();
    this.portsDisconnectionHandlers = new Map();
  }

  addConnection(port: chrome.runtime.Port) {
    const id = createUUID();
    this.ports.set(id, port);
    this.setupListeners(id);
  }

  setupListeners(id: string) {
    const port = this.ports.get(id);
    if (port && !port.onMessage.hasListener(this.onMessage)) {
      const onDisconnect = this.removePort.bind(this, id);
      this.portsDisconnectionHandlers.set(id, onDisconnect);
      port.onMessage.addListener(this.onMessage);
      port.onDisconnect.addListener(onDisconnect);
    }
  }

  removePort = (id: string) => {
    const port = this.ports.get(id);

    if (!port) return;

    const onDisconnect = this.portsDisconnectionHandlers.get(id);
    port?.onMessage.removeListener(this.onMessage);
    onDisconnect && port?.onDisconnect.removeListener(onDisconnect);
    this.portsDisconnectionHandlers.delete(id);
    this.ports.delete(id);
    this.emit(MessageTypes.removeConnection, id);
  };

  postMessage = (message: CommunicationMessage) => {
    const port = this.ports.get(message.id!);
    if (port) {
      port.postMessage(message);
    }
  };

  broadcast = (origins: Array<string> | string, message: EventMessage) => {
    const originList = Array.isArray(origins) ? origins : [origins];
    // biome-ignore lint/complexity/noForEach: <explanation>
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
    listener: (message: CommunicationEventArg<E>) => void
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
      })
    );
  };

  destroy() {
    // biome-ignore lint/complexity/noForEach: <explanation>
    this.ports.forEach((port) => port.disconnect());
    this.ports.clear();
    this.portsDisconnectionHandlers.clear();
  }
}
