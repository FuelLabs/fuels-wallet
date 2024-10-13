import {
  BACKGROUND_SCRIPT_NAME,
  CONNECTOR_SCRIPT,
  CONTENT_SCRIPT_NAME,
  ContentScriptMessageTypes,
  EVENT_MESSAGE,
  MessageTypes,
} from '@fuel-wallet/types';
import type { CommunicationMessage } from '@fuel-wallet/types';
import { createJSONRPCSuccessResponse } from 'json-rpc-2.0';
import type { JSONRPCID } from 'json-rpc-2.0';

export class ContentProxyConnection {
  connection: chrome.runtime.Port | undefined = undefined;
  readonly connectorName: string;
  constructor(connectorName: string) {
    this.connectorName = connectorName;
    this.onMessageFromWindow = this.onMessageFromWindow.bind(this);
    this.onMessageFromExtension = this.onMessageFromExtension.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);

    this.connectAndAttachListeners();
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
    chrome.runtime.onMessage.addListener(this.handlePing);
    connection.onDisconnect.addListener(this.onDisconnect);
    this.connection = connection;
    window.addEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
    this.onStartEvent();
  }

  destroy(keepWindowListener = true) {
    this.connection?.onMessage.removeListener(this.onMessageFromExtension);
    chrome.runtime.onMessage.removeListener(this.handlePing);
    this.connection?.onDisconnect.removeListener(this.onDisconnect);
    this.connection?.disconnect();
    this.connection = undefined;
    if (!keepWindowListener) {
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

  shouldAcceptMessage(event: CommunicationMessage, origin: string) {
    return (
      origin === window.location.origin &&
      event.target === CONTENT_SCRIPT_NAME &&
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
    const { data: event, origin } = Object.freeze(message);
    if (this.shouldAcceptMessage(event, origin)) {
      if (!this.connection) {
        this.connectAndAttachListeners();
      }
      if (
        event.type === MessageTypes.request &&
        event.request.method === 'connectorName'
      ) {
        // If the message is a request for the connector name
        // we send it back to the sender without send to the background script.
        this.sendConnectorName(event.request.id!);
      } else {
        if (!this.connection) {
          this.connectAndAttachListeners();
        }
        // Otherwise we send the message to the background script
        this.connection?.postMessage({
          ...event,
          target: BACKGROUND_SCRIPT_NAME,
        });
      }
    }
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
