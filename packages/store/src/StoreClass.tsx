/* eslint-disable no-restricted-syntax */
import type { StateFrom } from 'xstate';

import { ReactFactory } from './ReactFactory';
import { atoms } from './atoms';
import type {
  Handlers,
  AddMachineParams,
  MachinesObj,
  ValueOf,
  Listener,
} from './types';
import { createHandlers } from './utils';

interface IStore<T extends MachinesObj> {
  /** @deprecated an internal property acting as a "phantom" type, not meant to be used at runtime */
  __TMachines: T;
}

export type CreateStoreOpts<T> = {
  id: string;
  storageBlacklist?: (keyof T)[];
};

export type StoreClassOpts<T extends MachinesObj> = CreateStoreOpts<T>;
export class StoreClass<T extends MachinesObj> implements IStore<T> {
  __TMachines = {} as T;
  constructor(readonly opts: StoreClassOpts<T>) {}

  /**
   * Add a new machine to the global store.
   * @param key - the key of the machine
   * @param machine - the machine to add
   * @param opts - the options to pass to the machine
   * @returns the store instance
   */
  addMachine<K extends keyof T>(
    key: K,
    machine: AddMachineParams<T, K>[1],
    opts: AddMachineParams<T, K>[2] = {}
  ) {
    const { store, machinesAtom } = atoms;
    const isBlackListed = this.opts.storageBlacklist?.includes(key);
    store.set(machinesAtom, {
      isBlackListed,
      key: key.toString(),
      getMachine: machine,
      getOptions: opts,
    });
    return this;
  }

  /**
   * Attach handlers to the store.
   * @param cb - a callback that receives the `send` and `broadcast` functions
   * @returns the store instance
   * @example
   * store.addHandlers((send, broadcast) => ({
   *   increment: () => send('counter', { type: 'INCREMENT' }),
   *   reset: () => broadcast('RESET'),
   * }));
   */
  addHandlers<H extends Handlers>(cb: (store: StoreClass<T>) => H) {
    const { store, keysAtom } = atoms;
    const keys = Object.keys(store.get(keysAtom));
    const handlers = createHandlers(keys, cb(this));
    Object.assign(this, handlers);
    return this as typeof this & {
      [K in keyof H]: H[K];
    };
  }

  /**
   * Setup the store. Adds the hooks and the provider to the store instance.
   * @returns the store instance
   * @example
   * store.setup();
   */
  setup() {
    const factory = new ReactFactory();
    const hooks = factory.createHooks();
    const StoreProvider = factory.createProvider();
    Object.assign(this, { StoreProvider });
    Object.assign(this, hooks);

    type Hooks = typeof hooks;
    type StoreReturn = typeof this & {
      [K in keyof Hooks]: Hooks[K];
    } & {
      StoreProvider: typeof StoreProvider;
    };
    return this as Omit<StoreReturn, 'setup' | 'states'>;
  }

  /**
   * Reset the store. Stops and starts all the services.
   * @returns the store instance
   * @example
   *
   * store.reset();
   */
  reset() {
    const { store, keysAtom, serviceAtom } = atoms;
    const keys = store.get(keysAtom);
    for (const key of keys) {
      const service = store.get(serviceAtom(key));
      service.stop();
      service.start();
    }
    return this;
  }

  /**
   * Add a listener that is called when the store is started.
   * @param listener - the listener to add
   * @returns the store instance
   * @example
   * store.onStoreStart(() => {
   *   console.log('store started');
   * });
   */
  onStoreStart(listener: () => void) {
    const { store, onStoreStartAtom } = atoms;
    store.set(onStoreStartAtom, { type: 'subscribe', input: listener });
  }

  /**
   * Add a listener that is called when a specific state changes.
   * @param key - the key of the service
   * @param listener - the listener to add
   * @returns the store instance
   * @example
   * store.onStateChange('counter', (state) => {
   *   console.log('counter state changed', state);
   * });
   */
  onStateChange<K extends keyof T>(
    key: K,
    listener: Listener<StateFrom<T[K]>>['listener']
  ) {
    const { store, onStateChangeAtom } = atoms;
    store.set(onStateChangeAtom, {
      type: 'subscribe',
      input: { key: key.toString(), listener },
    });
  }

  /**
   * Send an event to a specific service.
   * @param key - the key of the service
   * @param ev - the event to send
   * @example
   * store.send('counter', { type: 'INCREMENT' });
   */
  send<K extends keyof T>(key: K, ev: ValueOf<T>['__TEvent']) {
    const { store, serviceAtom } = atoms;
    const service = store.get(serviceAtom(key.toString()));
    service.send(ev);
    return this;
  }

  /**
   * Broadcast an event to all services.
   * @param ev - the event to broadcast
   * @example
   * store.broadcast('RESET');
   */
  broadcast(ev: ValueOf<T>['__TEvent']) {
    const { store, keysAtom, serviceAtom } = atoms;
    const keys = store.get(keysAtom);
    for (const key of keys) {
      const service = store.get(serviceAtom(key));
      service.send(ev);
    }
    return this;
  }
}

export type StoreSend<T extends MachinesObj> = StoreClass<T>['send'];
export type StoreBroadcast<T extends MachinesObj> = StoreClass<T>['broadcast'];

/**
 * Create a store instance.
 * @param opts - StoreClassOpts
 * @returns a store instance
 * @example
 * const store = createStore({
 *  id: 'my-store',
 * })
 *
 * store.setup((send) => ({
 *   handlers: {
 *     increment: () => send('INCREMENT'),
 *     decrement: () => send('DECREMENT'),
 *   },
 * }));
 *
 * store.increment();
 * store.decrement();
 *
 */
export function createStore<T extends MachinesObj>(opts: CreateStoreOpts<T>) {
  return new StoreClass<T>(opts);
}
