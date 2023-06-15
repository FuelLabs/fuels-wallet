/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'events';

export const windowEventBus = new EventEmitter();
export const proxyConnectorEventBus = new EventEmitter();

global.window = {
  location: {
    origin: 'http://origin.com',
  },
  origin: 'http://origin.com',
  addEventListener(event: string, cb: () => any) {
    windowEventBus.on(event, cb);
  },
  postMessage(message: any): void {
    windowEventBus.emit('message', {
      data: message,
      origin: 'http://origin.com',
    });
  },
} as any;

global.chrome = {
  runtime: {
    connect: (id: string) => {
      if (!id) {
        throw new Error('No extension id provided');
      }
      return {
        disconnect: () => {},
        onMessage: {
          addListener: (cb: any) => {
            proxyConnectorEventBus.on(`${id}:message`, cb);
          },
        },
        onDisconnect: {
          addListener: (cb: any) => {
            proxyConnectorEventBus.on(`${id}:disconnect`, cb);
          },
        },
        postMessage: (data: any) => {
          proxyConnectorEventBus.emit(`${id}:message`, data);
        },
      };
    },
  },
} as any;
