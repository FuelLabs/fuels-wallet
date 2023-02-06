/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from 'jotai/vanilla';
import type { Getter } from 'jotai/vanilla';
import type {
  AnyInterpreter,
  AnyState,
  AnyStateMachine,
  InterpreterFrom,
} from 'xstate';
import { InterpreterStatus, State } from 'xstate';

import type { InterpreterOptions } from '../types';
import { createIdleService, setMachine, Storage } from '../utils';

import { atomWithSubcription } from './atomWithSubscription';

const cachedMachine = new Map<string, AnyStateMachine>();
const cachedOptions = new Map<string, InterpreterOptions | undefined>();

export type GetOptions<M extends AnyStateMachine = AnyStateMachine> =
  | InterpreterOptions<M>
  | ((get: Getter) => InterpreterOptions<M>);

export type AtomWithMachineOpts<M extends AnyStateMachine> = {
  key: string;
  getMachine: M | ((get: Getter) => M);
  getOptions?: GetOptions<M>;
  isBlackListed?: boolean;
};

export function atomWithMachine<
  M extends AnyStateMachine,
  S extends AnyInterpreter = InterpreterFrom<M>
>({
  key,
  getMachine,
  getOptions,
  isBlackListed = false,
}: AtomWithMachineOpts<M>) {
  let initialized = false;

  /**
   * Check if the machine are a getter or not.
   * If it is a getter, then we need to get the machine safely and
   * cache them. If it is not a getter, then we can just cache the machine.
   * @param safeGet Getter
   */
  function getSafeMachine(safeGet: Getter) {
    let machine: M;
    try {
      machine = isGetter(getMachine) ? getMachine(safeGet) : getMachine;
      cachedMachine.set(key, machine);
    } catch (error) {
      machine = cachedMachine.get(key) as M;
    }
    return machine;
  }
  /**
   * Check if the options are a getter or not.
   * If it is a getter, then we need to get the options safely and
   * cache them. If it is not a getter, then we can just cache the options.
   * @param safeGet Getter
   */
  function getSafeOpts(safeGet: Getter) {
    let options: InterpreterOptions<M> | undefined;
    try {
      options = isGetter(getOptions) ? getOptions(safeGet) : getOptions;
      cachedOptions.set(key, options);
    } catch (error) {
      options = cachedOptions.get(key);
    }
    return options;
  }
  /**
   * Get the machine and options safely. This is needed mainly because
   * of live reloading in development. We need to make sure that the
   * machine and options are not accessed after initialization.
   * @param get Getter
   */
  function getSafeMachineAndOpts(get: Getter) {
    let initializing = true;
    const safeGet: typeof get = (...args) => {
      if (initializing) return get(...args);
      throw new Error('get not allowed after initialization');
    };
    const machine = getSafeMachine(safeGet);
    const options = getSafeOpts(safeGet);
    initializing = false;
    return { machine, options };
  }
  /**
   * Start the service if it is not already started.
   * Get state first from options, then from cache, then from state storage.
   * @param get Getter
   * @param service Service
   */
  function startService(get: Getter, service: S) {
    const { options } = getSafeMachineAndOpts(get);
    const stateStorage = !isBlackListed ? Storage.getItem(key) : null;
    const rehydrate = options?.state ?? stateStorage;
    if (!service.initialized && !initialized) {
      const state = rehydrate ? State.create(rehydrate as any) : undefined;
      service.start(state);
      initialized = true;
      return;
    }
    if (!service.initialized && initialized) {
      service.start();
    }
  }
  /**
   * Check if the machine is blacklisted, if it is, we need to update the state
   * storage. If it is not, we need to clear the state storage.
   */
  function updateStateStorage(state: AnyState) {
    if (!isBlackListed) {
      Storage.setItem(key, state);
      return;
    }
    const curr = Storage.getItem(key);
    if (curr) Storage.removeItem(key);
  }

  /**
   * Create the machine atom. This atom is used to get the machine.
   */
  const machineAtom = atom((get) => {
    const cached = cachedMachine.get(key);
    if (cached) return cached as M;
    const { machine, options } = getSafeMachineAndOpts(get);
    return setMachine(machine, options) as M;
  });

  /**
   * Create the service atom. This atom is used to get the service.
   */
  const serviceAtom = atom((get) => {
    const { machine, options } = getSafeMachineAndOpts(get);
    const service = createIdleService(machine, options) as S;
    startService(get, service);
    return service;
  });

  /**
   * Create the state atom. This atom is used to get the state.
   */
  const stateAtom = atom((get) => {
    return get(serviceAtom).getSnapshot();
  });

  /**
   * Create the machine state atom. This atom is used to get the machine state,
   * start the service, update the state on storage and cache,
   * and unsubscribe from the service.
   */
  const machineStateAtom = atomWithSubcription(
    (get) => get(stateAtom),
    (get, _set, cleanup) => {
      const service = get(serviceAtom);
      const sub = service.subscribe(updateStateStorage);
      startService(get, service);
      cleanup({
        unsubscribe() {
          service.stop();
          service.status = InterpreterStatus.Stopped;
          sub.unsubscribe();
        },
      });
    }
  );

  return atom((get) => {
    const state = get(machineStateAtom);
    const machine = get(machineAtom);
    const service = get(serviceAtom);
    return {
      state,
      machine,
      service,
      atoms: {
        state: stateAtom,
        machine: machineAtom,
        service: serviceAtom,
      },
    };
  });
}

/**
 *
 * @param v
 * @returns
 */
function isGetter<T>(v: T | ((get: Getter) => T)): v is (get: Getter) => T {
  return typeof v === 'function';
}
