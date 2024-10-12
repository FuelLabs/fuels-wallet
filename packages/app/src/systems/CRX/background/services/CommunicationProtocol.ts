import { BaseConnection, createUUID } from '@fuel-wallet/connections';
import type {
  CommunicationEventArg,
  CommunicationMessage,
  EventMessage,
} from '@fuel-wallet/types';
import {
  BACKGROUND_SCRIPT_NAME,
  MessageTypes,
  VAULT_SCRIPT_NAME,
} from '@fuel-wallet/types';

export class CommunicationProtocol extends BaseConnection {
  ports: Map<string, chrome.runtime.Port>;
  portsDisconnectionHandlers: Map<string, () => void>;
  messageTypesMap: Record<keyof typeof MessageTypes, boolean> = Object.keys(
    MessageTypes
  ).reduce(
    (acc, type) => {
      acc[type] = type !== 'ping';
      return acc;
    },
    {} as Record<keyof typeof MessageTypes, boolean>
  );

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

  onMessage = async (
    message: CommunicationMessage,
    port: chrome.runtime.Port
  ) => {
    const sender = port.sender;
    if (sender?.id !== chrome.runtime.id) return;
    if (
      message.target !== VAULT_SCRIPT_NAME &&
      message.target !== BACKGROUND_SCRIPT_NAME
    )
      return;
    if (!this.messageTypesMap[message.type]) return;

    const portId = this.getPortId(port);

    this.emit(
      message.type,
      Object.freeze({
        ...message,
        id: portId,
        sender: port.sender,
      })
    );
    return;
  };

  destroy() {
    this.client.rejectAllPendingRequests('Connection closed');
    // biome-ignore lint/complexity/noForEach: <explanation>
    this.ports.forEach((port) => port.disconnect());
    this.ports.clear();
    this.portsDisconnectionHandlers.clear();
  }
}
