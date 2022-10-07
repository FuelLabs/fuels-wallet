import { v4 } from 'uuid';

import { SERVICE_NAME } from './config';
import type { EventConnector } from './events';
import { Events, getConnector } from './events';

export type FuelWeb3Options = {
  connector: EventConnector;
};

class FuelWeb3 {
  readonly id: string;
  readonly name: string;
  readonly events: Events<any>;

  constructor(options?: FuelWeb3Options) {
    this.id = v4();
    this.name = SERVICE_NAME;
    const connector = options?.connector || getConnector();
    this.events = new Events<any>({
      connector,
      id: this.id,
      name: this.name,
    });
  }

  async sendAndAwaitForEvent<T = any>(
    fn: () => void,
    eventName: string,
    eventErrorName: string
  ) {
    return new Promise<T>((resolve, reject) => {
      this.events.once(eventName, resolve);
      this.events.once(eventErrorName, reject);
      fn();
    });
  }

  async connect(cb?: () => void): Promise<boolean> {
    return this.sendAndAwaitForEvent<boolean>(
      () => {
        this.events.send('connect');
        cb?.();
      },
      'connected',
      'error'
    );
  }

  async disconnect(): Promise<boolean> {
    return this.sendAndAwaitForEvent<boolean>(
      () => {
        this.events.send('disconnect');
      },
      'disconnected',
      'error'
    );
  }

  // isConnected(): boolean {
  //   this.events.send('isConnected');
  //   return Promise.resolve(true);
  // }

  // onConnect(handler: () => void): () => void {
  //   // this.rpc.server.
  //   console.log('On connection change', handler);
  //   return () => {
  //     // Unsubscribe
  //     console.log('unsub');
  //   };
  // }
}

export default FuelWeb3;
