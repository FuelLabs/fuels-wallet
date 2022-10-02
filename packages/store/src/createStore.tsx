/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from '@xstate/react';
import { useSyncExternalStore } from 'react';
import type { AnyState, AnyStateMachine, StateFrom } from 'xstate';
import { interpret } from 'xstate';

import type {
  StateObj,
  ValueOf,
  Service,
  MachinesObj,
  RestParams,
  Opts,
} from './types';
import useConstant from './useConstant';

interface IStore<T extends MachinesObj> {
  /** @deprecated an internal property acting as a "phantom" type, not meant to be used at runtime */
  __TMachines: T;
}

export class Store<T extends MachinesObj> implements IStore<T> {
  private listeners = new Set<(state: StateObj<T>) => void>();
  readonly services = new Map<keyof T, Service<T>>();
  __TMachines = {} as T;

  #prevState!: StateObj<T>;
  #currentState!: StateObj<T>;
  #initialState: StateObj<T> = {} as StateObj<T>;

  constructor(readonly machines: T) {
    Object.entries(machines).forEach(([key, machine]) => {
      const item = machine?.context ? machine : machine?.withContext({});
      if (item) {
        const service = this.#createService(key, item);
        service.__storeKey = key;
        this.services.set(key, service);
      }
    });
  }

  public getState() {
    return { ...(this.#currentState ?? this.#initialState) };
  }

  public getPrevState() {
    return { ...(this.#prevState ?? this.#initialState) };
  }

  public getInitialState() {
    return { ...this.#initialState };
  }

  public subscribe(listener: (state: StateObj<T>) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public send<K extends keyof T>(key: K, ev: T[K]['__TEvent']) {
    const service = this.services.get(key);
    service?.send(ev);
  }

  public broadcast(ev: ValueOf<T>['__TEvent']) {
    Array.from(this.services.values()).forEach((service) => {
      service.send(ev);
    });
  }

  public setState<S extends AnyState>(key: keyof T, next: S) {
    const curr = { ...this.getState()[key as string] } as S;
    this.#prevState = { ...this.getState(), [key]: curr };
    this.#currentState = { ...this.getState(), [key]: next };
    this.listeners.forEach((listener) => {
      listener(this.#currentState);
    });
  }

  public setService<S extends Service<T>>(
    service: S,
    ...[opts = {}]: RestParams<S['machine']>
  ) {
    useConstant(() => {
      const key = service.__storeKey;
      const machine = this.machines[key];
      const newService = this.#createService(key, machine, opts as Opts<any>);
      this.services.set(key, newService);
    });
  }

  /**
   * This method was heavilly inspired on @xstate/react
   */
  #createService<M extends AnyStateMachine>(
    key: keyof T,
    machine: M,
    opts: Opts<M> = {}
  ): Service<T> {
    const { context, guards, actions, services, delays, ...interpreterOps } =
      opts;

    const machineConfig = {
      context,
      guards,
      actions,
      services,
      delays,
    };

    const machineWithConfig = machine?.withConfig(machineConfig as any, () => ({
      ...machine.context,
      ...context,
    }));

    const service = interpret(machineWithConfig || {}, interpreterOps);
    Object.assign(service.machine.options.actions!, actions);
    Object.assign(service.machine.options.guards!, guards);
    Object.assign(service.machine.options.services!, services);
    Object.assign(service.machine.options.delays!, delays);
    (service as Service<T>).__storeKey = key;
    return service as Service<T>;
  }
}

export function createStore<T extends MachinesObj>(machines: T) {
  const store = new Store<T>(machines);
  return {
    __store: store,
    send: store.send.bind(store),
    broadcast: store.broadcast.bind(store),
    subscribe: store.subscribe.bind(store),
    getState: store.getState.bind(store),
    setService: store.setService.bind(store),
    useStoreSelector: useSelector,
    useStoreService(key: keyof T) {
      return useSyncExternalStore(store.subscribe.bind(store), () => {
        const service = store.services.get(key) as Service<T>;
        if (!service.initialized) {
          service.start();
        }
        return service;
      });
    },
  };
}

type CreateStore = ReturnType<typeof createStore<any>>;
type StoreMachine<T extends CreateStore> = T['__store']['__TMachines'];
export type StateKeys<T extends CreateStore> = keyof StoreMachine<T>;
export type StateOf<K extends StateKeys<T>, T extends CreateStore> = StateFrom<
  StoreMachine<T>[K]
>;
