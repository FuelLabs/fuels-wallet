import { BaseConnection, createUUID } from '@fuel-wallet/connections';
import type {
  CommunicationEventArg,
  CommunicationMessage,
  EventMessage,
} from '@fuel-wallet/types';
import {
  BACKGROUND_SCRIPT_NAME,
  CONTENT_SCRIPT_NAME,
  ContentScriptMessageTypes,
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
    const tabsWithPort = new Set<number>();
    // biome-ignore lint/complexity/noForEach: <explanation>
    this.ports.forEach((port) => {
      if (originList.includes(port.sender?.origin || '')) {
        port.postMessage(message);
        if (port.sender?.tab?.id !== undefined) {
          tabsWithPort.add(port.sender.tab.id);
        }
      }
    });
    if (message.target !== CONTENT_SCRIPT_NAME) return;
    for (const origin of originList) {
      this.sendToTabs(origin, message, tabsWithPort);
    }
  };

  // dApp ports close when the worker stops and only reopen on the next page
  // request, so idle tabs get the event through chrome.tabs instead
  private async sendToTabs(
    origin: string,
    message: EventMessage,
    skipTabIds: Set<number>
  ) {
    try {
      const tabs = await chrome.tabs.query({ url: `${origin}/*` });
      for (const tab of tabs) {
        if (tab.id === undefined || skipTabIds.has(tab.id)) continue;
        chrome.tabs
          .sendMessage(
            tab.id,
            { type: ContentScriptMessageTypes.EVENT, origin, message },
            { frameId: 0 }
          )
          // Tabs without the content script have no receiving end
          .catch(() => {});
      }
    } catch {}
  }

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
