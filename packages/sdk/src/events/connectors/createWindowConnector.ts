import type { EventConnector } from '../types';

export const createWindowConnector = ({
  target,
  origin,
}: {
  target: Window;
  origin: string;
}): EventConnector => {
  return {
    postMessage: (request) => {
      target.postMessage(request, origin);
    },
    setupListener: (onMessage) => {
      target.addEventListener('message', (message) => {
        if (message.origin === origin) {
          onMessage({
            ...message.data,
            origin,
          });
        }
      });
    },
  };
};
