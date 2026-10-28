import {
  BACKGROUND_SCRIPT_NAME,
  CONNECTOR_SCRIPT,
  CONTENT_SCRIPT_NAME,
  ContentScriptMessageTypes,
  EVENT_MESSAGE,
  MessageTypes,
} from '@fuel-wallet/types';
import type { CommunicationMessage } from '@fuel-wallet/types';
import type { JSONRPCID } from 'json-rpc-2.0';
// Deep import keeps the rest of json-rpc-2.0 out of the content script bundle
import { createJSONRPCSuccessResponse } from 'json-rpc-2.0/dist/models';

// The port opens on the first page message, so pages without a dApp never wake the worker
export class ContentProxyConnection {
  connection: chrome.runtime.Port | undefined = undefined;
  readonly connectorName: string;
  private hasConnected = false;

  constructor(connectorName: string) {
    this.connectorName = connectorName;
    this.onMessageFromWindow = this.onMessageFromWindow.bind(this);
    this.onMessageFromExtension = this.onMessageFromExtension.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);

    chrome.runtime.onMessage.addListener(this.handlePing);
    chrome.runtime.onMessage.addListener(this.onEventFromTabs);
    window.addEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
    this.onStartEvent();
  }

  /**
   * Sends a start event to the connector script
   * to notify that the extension is available.
   *
   * This is useful to notify once a extension is installed
   * or if the service is restarted.
   */
  onStartEvent() {
    this.postMessage({
      type: MessageTypes.event,
      target: CONNECTOR_SCRIPT,
      connectorName: this.connectorName,
      events: [
        {
          event: 'start',
          params: [],
        },
      ],
    });
  }

  connectAndAttachListeners() {
    const connection = chrome.runtime.connect(chrome.runtime.id, {
      name: BACKGROUND_SCRIPT_NAME,
    });
    connection.onMessage.addListener(this.onMessageFromExtension);
    connection.onDisconnect.addListener(this.onDisconnect);
    this.connection = connection;
    // The page was already notified on load, only notify again on reconnect
    if (this.hasConnected) {
      this.onStartEvent();
    }
    this.hasConnected = true;
  }

  destroy(keepWindowListener = true) {
    this.connection?.onMessage.removeListener(this.onMessageFromExtension);
    this.connection?.onDisconnect.removeListener(this.onDisconnect);
    this.connection?.disconnect();
    this.connection = undefined;
    if (!keepWindowListener) {
      chrome.runtime.onMessage.removeListener(this.handlePing);
      chrome.runtime.onMessage.removeListener(this.onEventFromTabs);
      window.removeEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
    }
  }

  onDisconnect = () => {
    this.destroy();
  };

  static start(providerWallet: string) {
    return new ContentProxyConnection(providerWallet);
  }

  onMessageFromExtension = (message: CommunicationMessage) => {
    const shouldAcceptMessage = message.target === CONTENT_SCRIPT_NAME;
    if (shouldAcceptMessage) {
      this.postMessage(message);
    }
  };

  // The worker pushes events here when this tab has no open port
  onEventFromTabs = (
    message:
      | { type: string; origin?: string; message?: CommunicationMessage }
      | undefined,
    sender: chrome.runtime.MessageSender
  ) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type !== ContentScriptMessageTypes.EVENT || !message.message) {
      return;
    }
    // Frames from other origins must not receive account data
    if (message.origin !== window.location.origin) return;
    // An open port already delivered the event
    if (this.connection) return;
    this.onMessageFromExtension(message.message);
  };

  shouldAcceptMessage(event: CommunicationMessage, origin: string) {
    return (
      origin === window.location.origin &&
      event?.target === CONTENT_SCRIPT_NAME &&
      event.connectorName === this.connectorName
    );
  }

  sendConnectorName(id: JSONRPCID) {
    this.postMessage({
      type: MessageTypes.response,
      response: createJSONRPCSuccessResponse(id, this.connectorName),
      target: this.connectorName,
    });
  }

  onMessageFromWindow = (message: MessageEvent<CommunicationMessage>) => {
    // Firefox cannot freeze a page event seen through its Xray wrapper
    const { data: event, origin } = message;
    if (!this.shouldAcceptMessage(event, origin)) return;
    // The extension was reloaded or disabled, a new content script takes over
    if (!chrome.runtime?.id) {
      window.removeEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
      return;
    }
    if (
      event.type === MessageTypes.request &&
      event.request.method === 'connectorName'
    ) {
      this.sendConnectorName(event.request.id!);
      return;
    }
    if (!this.connection) {
      this.connectAndAttachListeners();
    }
    this.connection?.postMessage({
      ...event,
      target: BACKGROUND_SCRIPT_NAME,
    });
  };

  handlePing(
    event: { type: string } | undefined,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ) {
    if (event?.type === ContentScriptMessageTypes.PING) {
      sendResponse({
        type: ContentScriptMessageTypes.PONG,
      });
    }
  }

  postMessage(message: CommunicationMessage) {
    const postMessage = {
      ...message,
      target: CONNECTOR_SCRIPT,
      connectorName: this.connectorName,
    };
    window.postMessage(postMessage, window.location.origin);
  }
}
