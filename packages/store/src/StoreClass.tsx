/* eslint-disable no-restricted-syntax */
import type { AnyInterpreter, AnyState, StateFrom } from 'xstate';

import { ReactFactory } from './ReactFactory';
import type { CreateStoreAtomsReturn } from './atoms';
import { createStoreAtoms } from './atoms';
import type {
  Handlers,
  MachinesObj,
  ValueOf,
  Listener,
  StoreServiceObj,
  AddMachineInput,
  WaitForArgs,
  WaitForStateArgs,
  StateItem,
} from './types';
import { createHandlers, waitFor } from './utils/xstate';

interface IStore<T extends MachinesObj> {
  /** @deprecated an internal property acting as a "phantom" type, not meant to be used at runtime */
  __TMachines: T;
}

export type CreateStoreOpts<T> = {
  id: string;
  persistedStates?: (keyof T)[];
};

export type StoreClassReturn<T> = Omit<T, 'setup'>;
export type StoreClassOpts<T extends MachinesObj> = CreateStoreOpts<T> & {
  atoms: CreateStoreAtomsReturn<T>;
};

export class StoreClass<T extends MachinesObj> implements IStore<T> {
  __TMachines = {} as T;
  readonly opts = {} as StoreClassOpts<T>;
  constructor(opts: StoreClassOpts<T>) {
    this.opts = opts;
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  /**
   * Get all the services from the store.
   * @returns an object with all the services
   * @example
   * const { counter, accounts } = store.services;
   */
  get services() {
    const { store, servicesAtom } = this.opts.atoms;
    return store.get(servicesAtom) as StoreServiceObj<T>;
  }

  /**
   * Get a list of all the keys of the services that are being save
   * in the Local Storage.
   */
  get persistedStates() {
    return this.opts.persistedStates;
  }

  /**
   * Get the store id.
   */
  get id() {
    return this.opts.id;
  }

  // ---------------------------------------------------------------------------
  // Public methods
  // ---------------------------------------------------------------------------

  /**
   * Add a new machine to the global store.
   * @param key - the key of the machine
   * @param machine - the machine to add
   * @param opts - the options to pass to the machine
   * @returns the store instance
   */
  addMachine<K extends keyof T>(
    key: K,
    machine: AddMachineInput<T, K>['getMachine'],
    opts: AddMachineInput<T, K>['getOptions'] = {}
  ) {
    const { store, machinesAtom } = this.opts.atoms;
    const hasStorage = this.opts.persistedStates?.includes(key);
    store.set(machinesAtom, {
      hasStorage,
      key,
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
   * store.addHandlers(store => ({
   *   increment: () => store.send('counter', { type: 'INCREMENT' }),
   *   resetCounter: () => store.broadcast('RESET'),
   * }));
   */
  addHandlers<H extends Handlers>(
    cb: <S extends StoreClass<T>>(
      store: S
    ) => { [P in keyof H]: P extends keyof StoreClass<T> ? never : H[P] }
  ) {
    const { store, keysAtom } = this.opts.atoms;
    const keys = Object.keys(store.get(keysAtom));
    const handlers = createHandlers(keys, cb(this));
    Object.assign(this, handlers);
    return this as typeof this & {
      [P in keyof H]: H[P];
    };
  }

  /**
   * Setup the store. Adds the hooks and the provider to the store instance.
   * @returns the store instance
   * @example
   * store.setup();
   */
  setup() {
    const factory = new ReactFactory(this.opts.atoms);
    const hooks = factory.createHooks();
    const StoreProvider = factory.createProvider();
    const getStateFrom = this.getStateFrom.bind(this);
    const waitFor = this.waitFor.bind(this);
    Object.assign(this, hooks);
    Object.assign(this, { StoreProvider });
    Object.assign(this, { getStateFrom });
    Object.assign(this, { waitFor });

    type Hooks = typeof hooks;
    type Return = typeof this & {
      [P in keyof Hooks]: Hooks[P];
    } & {
      StoreProvider: typeof StoreProvider;
    };

    return this as StoreClassReturn<Return>;
  }

  /**
   * Send an event to a specific service.
   * @param key - the key of the service
   * @param ev - the event to send
   * @example
   * store.send('counter', { type: 'INCREMENT' });
   */
  send<K extends keyof T>(key: K, ev: T[K]['__TEvent']) {
    const service = this.services[key];
    service.send(ev);
    return this as StoreClassReturn<typeof this>;
  }

  /**
   * Broadcast an event to all services.
   * @param ev - the event to broadcast
   * @example
   * store.broadcast('RESET');
   */
  broadcast<E extends ValueOf<T>['__TEvent']>(ev: E) {
    for (const service of Object.values(this.services)) {
      service.send(ev);
    }
    return this as StoreClassReturn<typeof this>;
  }

  /**
   * Reset the store. Stops and starts all the services.
   * @returns the store instance
   * @example
   *
   * store.reset();
   */
  reset() {
    const { store, keysAtom, serviceAtom } = this.opts.atoms;
    const keys = store.get(keysAtom);
    for (const key of keys) {
      const service = store.get(serviceAtom(key));
      service.stop();
      service.start();
    }
    return this as StoreClassReturn<typeof this>;
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
    const { store, onStoreStartAtom } = this.opts.atoms;
    store.set(onStoreStartAtom, listener);
    return this as StoreClassReturn<typeof this>;
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
    givenListener: Listener<[StateFrom<T[K]>]>
  ) {
    const { store, onStateChangeAtom } = this.opts.atoms;
    const service = this.services[key];
    const listener = givenListener as Listener<[AnyState]>;
    store.set(onStateChangeAtom, { service, listener });
    return this as StoreClassReturn<typeof this>;
  }

  /**
   * Get the current state of a specific service.
   * @param key - the key of the service
   * @returns the current state
   * @example
   * const { context } = store.getState('counter');
   */
  getStateFrom<K extends keyof T>(key: K) {
    const { store, serviceAtom } = this.opts.atoms;
    const service = store.get(serviceAtom(key));
    return service.getSnapshot() as StateFrom<T[K]>;
  }

  /**
   * Wait for a specific state to be reached.
   * @param key - the key of the service
   * @param givenState - a predicate function that returns a boolean
   * @param timeout - the timeout in milliseconds (default: 5 minutes)
   * @returns the current state value
   * @example
   * await store.waitForState('counter', 'active');
   * // or
   * await store.waitForState('counter', (state) => state.matches('active'));
   */
  async waitFor<K extends keyof T>(...[key, ...args]: WaitForArgs<T, K>) {
    const service = this.services[key];
    return waitFor(service, ...args);
  }

  /**
   * Wait for a specifice state to be reached.
   * @param key - the key of the service
   * @param done - the state to wait for complete (default: 'done')
   * @param failure - the state to wait for failure (default: 'failed')
   * @param failureMessage - the field of the context to use as the error message (default: 'error')
   * @param timeout - the timeout in milliseconds (default: 5000)
   * @returns the current state value
   * @example
   * await store.waitForState('counter');
   * // or
   * await store.waitForState('counter', 'done', 'failed', 'error');
   */
  public async waitForState<K extends keyof T, S extends StateItem<T, K>>(
    ...[
      key,
      {
        done = 'done',
        failure = 'failed',
        failureMessage = 'error',
        timeout = 5000,
      } = {},
    ]: WaitForStateArgs<T, K>
  ) {
    try {
      const service = this.services[key];
      const doneState = done;
      const failureState = failure;
      const failureMessageField = failureMessage;

      if (!service) {
        throw new Error('Service not found');
      }

      const appState = await waitFor<AnyInterpreter>(
        service,
        (state) => state.matches(doneState) || state.matches(failureState),
        timeout
      );
      if (appState.matches(failureState)) {
        throw new Error(appState.context[failureMessageField], {
          cause: 'CustomState',
        });
      }

      return appState as S;
    } catch (err: unknown) {
      const error = err as Error & { cause?: string };
      // Timeout of 5000 ms exceeded
      if (/Timeout of (.*) ms exceeded/.test(error.message)) {
        throw new Error(
          `Window closed by inactivity after ${timeout / 1000 / 60} minutes!`
        );
      }
      // Throw customized error from machine
      if (err && (err as { cause: string }).cause === 'CustomState') {
        throw err as Error;
      }
      // Throw other errors that can be thrown
      throw err;
    }
  }
}

export type StoreSend<T extends MachinesObj> = StoreClass<T>['send'];
export type StoreBroadcast<T extends MachinesObj> = StoreClass<T>['broadcast'];

/**
 * Create a store instance.
 * @param opts - StoreClassOpts
 * @returns a store instance
 * @example
 * const store$ = createStore<StoreMachines>({
 *   id: 'fuelStore',
 * });
 *
 * export const store = store$
 *   .addMachine(Services.accounts, () => accountsMachine)
 *   .addMachine(Services.networks, () => networksMachine)
 *   .addHandlers(accountEvents)
 *   .addHandlers(networkEvents)
 *   .setup();
 *
 * export const { StoreProvider } = store;
 *
 */
export function createStore<T extends MachinesObj>(opts: CreateStoreOpts<T>) {
  const atoms = createStoreAtoms<T>(opts.id);
  return new StoreClass<T>({ ...opts, atoms });
}
