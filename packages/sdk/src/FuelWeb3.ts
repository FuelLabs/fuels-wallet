import { v4 } from 'uuid';

import { SERVICE_NAME } from './config';
import type { EventConnector } from './events';
import { createWindowConnector, Events } from './events';
import type { MachineContext } from './machines/applicationMachine';

export type FuelWeb3Options = {
  connector: EventConnector;
};

class FuelWeb3 {
  readonly id: string;
  readonly name: string;
  readonly events: Events;

  #state?: MachineContext;

  constructor(options?: FuelWeb3Options) {
    this.id = v4();
    this.name = SERVICE_NAME;
    const connector = options?.connector || createWindowConnector(window);
    this.events = new Events({
      connector,
      id: this.id,
      name: this.name,
    });
    this.events.on('state', (state) => {
      this.#state = state;
    });
  }

  async sendAndAwaitForEvent<T = any>(
    fn: () => void,
    eventName: string,
    eventErrorName: string
  ) {
    return new Promise<T>((resolve, reject) => {
      this.events.once(eventName, resolve);
      this.events.once(eventErrorName, (error) => {
        reject(new Error(error));
      });
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

  isConnected(): boolean {
    return !!this.#state?.isConnected;
  }

  onConnect(handler: (isConnected: boolean) => void): () => void {
    const handlerWrapper = () => handler(this.isConnected());
    this.events.on('connected', handlerWrapper);
    this.events.on('disconnected', handlerWrapper);
    return () => {
      this.events.off('connected', handlerWrapper);
      this.events.off('disconnected', handlerWrapper);
    };
  }
}

export default FuelWeb3;
