import EventEmitter from 'events';

import type { EventConnector } from '../types';

const eventBus = new EventEmitter();

export const createMemoryConnector = (
  sender: string,
  receiver: string
): EventConnector => {
  return {
    postMessage: (request) => {
      eventBus.emit(`${receiver}:message`, request);
    },
    setupListener: (onMessage) => {
      eventBus.on(`${sender}:message`, (message) => {
        onMessage(message);
      });
    },
  };
};
