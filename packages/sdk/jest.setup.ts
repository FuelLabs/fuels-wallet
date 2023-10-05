/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'events';

(global as any).windowEventBus = new EventEmitter() as any;
(global as any).documentEventBus = new EventEmitter() as any;
(global as any).proxyConnectorEventBus = new EventEmitter() as any;

global.window = {
  location: {
    origin: 'http://origin.com',
  },
  origin: 'http://origin.com',
  addEventListener(event: string, cb: () => any) {
    windowEventBus.on(event, cb);
  },
  removeEventListener(event: string, cb: () => any) {
    windowEventBus.off(event, cb);
  },
  dispatchEvent(event: CustomEvent): void {
    windowEventBus.emit(event.type, event);
  },
  postMessage(message: any): void {
    windowEventBus.emit('message', {
      data: message,
      origin: 'http://origin.com',
    });
  },
} as any;

class CustomEvent {
  type: string;
  detail: any;
  constructor(type: string, params?: { detail: any }) {
    this.type = type;
    this.detail = params?.detail;
  }
}

global.CustomEvent = CustomEvent as any;

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

declare global {
  let windowEventBus: EventEmitter;
  let documentEventBus: EventEmitter;
  let proxyConnectorEventBus: EventEmitter;
}
