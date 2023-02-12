/* eslint-disable no-console */
import {
  PAGE_SCRIPT_NAME,
  BACKGROUND_SCRIPT_NAME,
  CONTENT_SCRIPT_NAME,
  EVENT_MESSAGE,
  MessageTypes,
} from '@fuel-wallet/types';
import type { CommunicationMessage } from '@fuel-wallet/types';

const PING_TIMEOUT = 1000;
const RECONNECT_TIMEOUT = 300;

export class ContentProxyConnection {
  connection: chrome.runtime.Port;
  _tryReconect?: NodeJS.Timer;

  constructor() {
    this.connection = this.connect();
    window.addEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
    this.keepAlive();
  }

  connect() {
    const connection = chrome.runtime.connect(chrome.runtime.id, {
      name: BACKGROUND_SCRIPT_NAME,
    });
    connection.onMessage.addListener(this.onMessageFromExtension);
    connection.onDisconnect.addListener(this.onDisconnect);
    return connection;
  }

  onDisconnect = () => {
    clearInterval(this._tryReconect);
    this._tryReconect = setInterval(() => {
      console.debug('[FUEL WALLET] reconnecting!');
      try {
        this.connection = this.connect();
        console.debug('[FUEL WALLET] reconnected!');
        clearInterval(this._tryReconect);
        // If fails it will try to reconnect
        // It should not throw an error to avoid
        // uncessary error reporting as it is expected
        // to fail if background script is not available.
      } catch (err: unknown) {
        if ((err as Error).message === 'Extension context invalidated.') {
          clearInterval(this._tryReconect);
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
      setTimeout(this.keepAlive, PING_TIMEOUT);
    } catch (err) {
      this.onDisconnect();
    }
  };

  static start() {
    return new ContentProxyConnection();
  }

  onMessageFromExtension = (message: CommunicationMessage) => {
    const shouldAcceptMessage = message.target === CONTENT_SCRIPT_NAME;
    if (shouldAcceptMessage) {
      this.postMessage(message);
    }
  };

  onMessageFromWindow = (message: MessageEvent<CommunicationMessage>) => {
    const { data: event, origin } = Object.freeze(message);
    const shouldAcceptMessage =
      origin === window.location.origin && event.target === CONTENT_SCRIPT_NAME;
    if (shouldAcceptMessage) {
      this.connection.postMessage({
        ...event,
        target: BACKGROUND_SCRIPT_NAME,
      });
    }
  };

  postMessage(message: CommunicationMessage) {
    const postMessage = {
      ...message,
      target: PAGE_SCRIPT_NAME,
    };
    window.postMessage(postMessage, window.location.origin);
  }
}
