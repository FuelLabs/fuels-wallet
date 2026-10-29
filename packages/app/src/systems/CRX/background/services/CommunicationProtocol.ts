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
import {
  forgetFrame,
  forgetTab,
  frameKey,
  framesFor,
  rememberFrame,
} from './dappFrames';

// A frame can be remembered for an origin it has since navigated away from,
// so a delivery is per origin: a rejected stale attempt must not block the
// live one
function deliveryKey(tabId: number, frameId: number, origin: string) {
  return `${frameKey(tabId, frameId)}|${origin}`;
}

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
    globalThis.chrome?.tabs?.onRemoved?.addListener((tabId) => {
      forgetTab(tabId);
    });
  }

  addConnection(port: chrome.runtime.Port) {
    const id = createUUID();
    this.ports.set(id, port);
    this.setupListeners(id);
    const { tab, frameId, origin } = port.sender ?? {};
    if (tab?.id !== undefined && origin) {
      rememberFrame({
        tabId: tab.id,
        frameId: frameId ?? 0,
        origin,
        connectionId: id,
      });
    }
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
    const framesWithPort = new Set<string>();
    // biome-ignore lint/complexity/noForEach: <explanation>
    this.ports.forEach((port) => {
      if (originList.includes(port.sender?.origin || '')) {
        port.postMessage(message);
        if (port.sender?.tab?.id !== undefined) {
          framesWithPort.add(
            deliveryKey(
              port.sender.tab.id,
              port.sender.frameId ?? 0,
              port.sender.origin ?? ''
            )
          );
        }
      }
    });
    if (message.target !== CONTENT_SCRIPT_NAME) return;
    this.sendToFrames(originList, message, framesWithPort);
  };

  // dApp ports close when the worker stops and only reopen on the next page
  // request, so idle frames get the event through chrome.tabs instead.
  // Known frames cover iframed dApps; the tab query covers top frames that
  // connected before session storage was cleared.
  private async sendToFrames(
    origins: string[],
    message: EventMessage,
    skip: Set<string>
  ) {
    const send = (
      tabId: number,
      frameId: number,
      origin: string,
      connectionId?: string
    ) => {
      const key = deliveryKey(tabId, frameId, origin);
      if (skip.has(key)) return;
      skip.add(key);
      chrome.tabs
        .sendMessage(
          tabId,
          { type: ContentScriptMessageTypes.EVENT, origin, message },
          { frameId }
        )
        .catch((error) => {
          // A frame that is gone has no receiving end; other errors, like
          // the content script not answering, still mean it was delivered
          if (
            connectionId &&
            /receiving end|no frame/i.test(String(error?.message))
          ) {
            forgetFrame(connectionId);
          }
        });
    };
    try {
      for (const frame of await framesFor(origins)) {
        send(frame.tabId, frame.frameId, frame.origin, frame.connectionId);
      }
      for (const origin of origins) {
        const tabs = await chrome.tabs.query({ url: `${origin}/*` });
        for (const tab of tabs) {
          if (tab.id !== undefined) send(tab.id, 0, origin);
        }
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
