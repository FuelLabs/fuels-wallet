/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from '@xstate/react';
import { useSyncExternalStore } from 'react';
import type { AnyState, AnyStateMachine, StateFrom } from 'xstate';
import { interpret } from 'xstate';

import type {
  StateObj,
  Service,
  MachinesObj,
  Opts,
  ValueOf,
  Events,
  RestParams,
} from './types';
import useConstant from './useConstant';

interface IStore<T extends MachinesObj> {
  /** @deprecated an internal property acting as a "phantom" type, not meant to be used at runtime */
  __TMachines: T;
}

export class StoreClass<T extends MachinesObj> implements IStore<T> {
  private listeners = new Set<(state: StateObj<T>) => void>();
  readonly services = new Map<keyof T, Service<T>>();
  public machines = new Map<keyof T, AnyStateMachine>();
  __TMachines = {} as T;

  #prevState!: StateObj<T>;
  #currentState!: StateObj<T>;
  #initialState: StateObj<T> = {} as StateObj<T>;

  constructor(services: T) {
    Object.entries(services).forEach(([key, machine]) => {
      const item = this.createMachine(key, machine());
      const service = this.createService(key, item);
      if (!service?.initialized) {
        service?.start();
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

  public send<K extends keyof T>(key: K, ev: ReturnType<T[K]>['__TEvent']) {
    const service = this.services.get(key);
    service?.send(ev);
  }

  public broadcast(ev: ReturnType<ValueOf<T>>['__TEvent']) {
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

  public createMachine<M extends AnyStateMachine>(
    key: keyof T,
    machine: M,
    opts: Opts<M> = {}
  ) {
    const { context, guards, actions, services, delays } = opts;
    const machineConfig = {
      context,
      guards,
      actions,
      services,
      delays,
    };
    const newMachine = machine?.withConfig(machineConfig as any, () => ({
      ...(machine?.context ?? {}),
      ...context,
    }));
    this.machines.set(key, newMachine);
    return newMachine;
  }

  /**
   * This method was heavilly inspired on @xstate/react
   */
  public createService<M extends AnyStateMachine>(
    key: keyof T,
    machine: M,
    opts: Opts<M> = {}
  ) {
    const { guards, actions, services, delays, ...interpreterOps } = opts;
    if (!machine) return null;
    const service = interpret(machine, interpreterOps);
    Object.assign(service.machine.options.actions!, actions);
    Object.assign(service.machine.options.guards!, guards);
    Object.assign(service.machine.options.services!, services);
    Object.assign(service.machine.options.delays!, delays);
    (service as Service<T>).__storeKey = key;
    this.services.set(key, service as Service<T>);
    return service as Service<T>;
  }

  public updateService<K extends keyof T>(
    key: K,
    ...[opts = {}]: RestParams<ReturnType<T[K]>>
  ) {
    const service = this.services.get(key);
    if (!service) return;
    Object.assign(service.machine.options.actions!, opts.actions);
    Object.assign(service.machine.options.guards!, opts.guards);
    Object.assign(service.machine.options.services!, opts.services);
    Object.assign(service.machine.options.delays!, opts.delays);
  }

  getSnapshot<K extends keyof T>(key: K) {
    const service = this.services.get(key);
    return service?.getSnapshot() as StateFrom<T[K]>;
  }

  reset() {
    this.#prevState = this.#initialState;
    this.#currentState = this.#initialState;
    this.listeners.clear();
    // eslint-disable-next-line no-restricted-syntax
    for (const [, service] of this.services.entries()) {
      service.stop();
      service.start();
    }
  }
}

export function createStore<T extends MachinesObj, E extends Events>(
  services: T,
  opts?: { events(store: StoreClass<T>): E }
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _store = new StoreClass<T>(services);

  const store = {
    /** @deprecated */
    __store: _store,
    services: _store.services,
    send: _store.send.bind(_store),
    broadcast: _store.broadcast.bind(_store),
    subscribe: _store.subscribe.bind(_store),
    getState: _store.getState.bind(_store),
    getSnapshot: _store.getSnapshot.bind(_store),
    reset: _store.reset.bind(_store),
    useSelector<K extends keyof T, R>(
      key: K,
      selector: (state: StateFrom<T[K]>) => R
    ) {
      const service = this.useService(key);
      return service && useSelector(service, selector);
    },
    useService(key: keyof T) {
      return useSyncExternalStore(_store.subscribe.bind(_store), () => {
        return _store.services.get(key) as Service<T>;
      });
    },
    useSetMachineConfig<K extends keyof T>(
      machineKey: K,
      ...[opts = {}]: RestParams<ReturnType<T[K]>>
    ) {
      useConstant(() => {
        _store.updateService(machineKey, opts);
      });
    },
  };

  const evts = opts?.events ? opts.events(_store) : ({} as E);
  const methods = Object.entries(evts).reduce((obj, [key, fn]) => {
    if (Object.keys(store).includes(key)) {
      throw new Error(
        `You cannot use "${key}" as event, because it's already a store property`
      );
    }
    return { ...obj, [key]: fn };
  }, {} as E);

  return {
    ...store,
    ...methods,
  } as typeof store & {
    [K in keyof E]: E[K];
  };
}

export type Store<
  T extends MachinesObj = any,
  E extends Events = any
> = ReturnType<typeof createStore<T, E>>;

type StoreMachine<T extends Store> = T['__store']['__TMachines'];
export type StateKeys<T extends Store> = keyof StoreMachine<T>;
export type StateOf<K extends StateKeys<T>, T extends Store> = StateFrom<
  StoreMachine<T>[K]
>;
