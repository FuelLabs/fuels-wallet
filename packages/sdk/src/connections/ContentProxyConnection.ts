import {
  PAGE_SCRIPT_NAME,
  BACKGROUND_SCRIPT_NAME,
  CONTENT_SCRIPT_NAME,
  EVENT_MESSAGE,
} from '../config';
import type { CommunicationMessage } from '../types';

export class ContentProxyConnection {
  connection: chrome.runtime.Port;

  constructor() {
    this.connection = chrome.runtime.connect(chrome.runtime.id, {
      name: BACKGROUND_SCRIPT_NAME,
    });
    this.connection.onMessage.addListener(this.onMessageFromExtension);
    window.addEventListener(EVENT_MESSAGE, this.onMessageFromWindow);
  }

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
