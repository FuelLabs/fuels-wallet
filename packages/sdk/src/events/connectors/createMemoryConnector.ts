import EventEmitter from 'events';

import type { EventConnector } from '../types';

const eventBus = new EventEmitter();

export const createMemoryConnector = (
  instance: string,
  sender: string,
  receiver: string
): EventConnector => {
  return {
    postMessage: (request) => {
      eventBus.emit(`${instance}:${receiver}:message`, request);
    },
    setupListener: (onMessage) => {
      eventBus.on(`${instance}:${sender}:message`, (message) => {
        onMessage({
          ...message,
          origin: receiver,
        });
      });
    },
  };
};
