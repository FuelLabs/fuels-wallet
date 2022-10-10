import type { EventConnector } from '../types';

export const createWindowConnector = (target: Window): EventConnector => {
  return {
    postMessage: (request) => {
      target.postMessage(request, window.origin);
    },
    setupListener: (onMessage) => {
      target.addEventListener('message', (message) => {
        if (message.origin === window.origin) {
          onMessage({
            ...message.data,
            origin,
          });
        }
      });
    },
  };
};
