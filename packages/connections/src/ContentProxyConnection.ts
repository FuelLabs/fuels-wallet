import { BACKGROUND_SCRIPT_NAME } from '@fuel-wallet/types';
import {
  CONNECTOR_SCRIPT,
  CONTENT_SCRIPT_NAME,
  type CommunicationMessage,
  EVENT_MESSAGE,
  MessageTypes,
} from '@fuels/connectors';
import { createJSONRPCSuccessResponse } from 'json-rpc-2.0';
import type { JSONRPCID } from 'json-rpc-2.0';

import { PING_TIMEOUT, RECONNECT_TIMEOUT } from './config';

export class ContentProxyConnection {
  connection: chrome.runtime.Port;
  _tryReconnect?: NodeJS.Timeout;
  _keepAlive?: NodeJS.Timeout;
  readonly connectorName: string;

  constructor(connectorName: string) {
    this.connection = this.connect();
    this.connectorName = connectorName;
    window.addEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
    this.keepAlive();
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

  connect() {
    const connection = chrome.runtime.connect(chrome.runtime.id, {
      name: BACKGROUND_SCRIPT_NAME,
    });
    connection.onMessage.addListener(this.onMessageFromExtension);
    connection.onDisconnect.addListener(this.onDisconnect);
    return connection;
  }

  destroy() {
    this.connection.onMessage.removeListener(this.onMessageFromExtension);
    this.connection.onDisconnect.removeListener(this.onDisconnect);
    this.connection.disconnect();
    clearInterval(this._tryReconnect);
    clearTimeout(this._keepAlive);
    window.removeEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
  }

  onDisconnect = () => {
    clearInterval(this._tryReconnect);
    this._tryReconnect = setInterval(() => {
      console.debug('[FUEL WALLET] reconnecting!');
      try {
        this.connection = this.connect();
        console.debug('[FUEL WALLET] reconnected!');
        clearInterval(this._tryReconnect);
        // If fails it will try to reconnect
        // It should not throw an error to avoid
        // unnecessary error reporting as it is expected
        // to fail if background script is not available.
      } catch (err: unknown) {
        if ((err as Error).message === 'Extension context invalidated.') {
          clearInterval(this._tryReconnect);
          console.debug('[FUEL WALLET] context invalidated!');
        }
      }
    }, RECONNECT_TIMEOUT);
  };

  keepAlive = () => {
    // Send ping message to background script
    // If background script is not available,
    // it will throw an error and we will try to reconnect.
    try {
      this.connection.postMessage({
        target: BACKGROUND_SCRIPT_NAME,
        type: MessageTypes.ping,
      });
      this._keepAlive = setTimeout(this.keepAlive, PING_TIMEOUT);
    } catch (_err) {
      this.onDisconnect();
    }
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
      if (
        event.type === MessageTypes.request &&
        event.request.method === 'connectorName'
      ) {
        // If the message is a request for the connector name
        // we send it back to the sender without send to the background script.
        this.sendConnectorName(event.request.id!);
      } else {
        // Otherwise we send the message to the background script
        this.connection.postMessage({
          ...event,
          target: BACKGROUND_SCRIPT_NAME,
        });
      }
    }
  };

  postMessage(message: CommunicationMessage) {
    const postMessage = {
      ...message,
      target: CONNECTOR_SCRIPT,
      connectorName: this.connectorName,
    };
    window.postMessage(postMessage, window.location.origin);
  }
}
