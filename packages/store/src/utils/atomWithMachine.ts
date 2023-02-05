/* eslint-disable symbol-description */

import { atom } from 'jotai/vanilla';
import type { Getter, WritableAtom } from 'jotai/vanilla';
import type {
  AnyInterpreter,
  AnyStateMachine,
  InterpreterFrom,
  Prop,
  StateFrom,
} from 'xstate';
import { State } from 'xstate';

import type { InterpreterOptions } from './types';
import { createIdleService, setMachine } from './xstate';

export const RESTART = Symbol();

type MaybeParam<T> = T extends (v: infer V) => unknown ? V : never;

type CachedMachineItem<
  M extends AnyStateMachine,
  S extends AnyInterpreter = InterpreterFrom<M>
> = {
  machine: M;
  service: S;
};

type AtomReturn<
  M extends AnyStateMachine,
  S extends AnyInterpreter = InterpreterFrom<M>
> = CachedMachineItem<M, S> & {
  state: StateFrom<M>;
  machine: M;
  service: S;
};

type AtomArguments<
  M extends AnyStateMachine,
  S extends AnyInterpreter = InterpreterFrom<M>
> = [MaybeParam<Prop<S, 'send'>> | typeof RESTART];

export type AtomWithMachine<
  M extends AnyStateMachine = AnyStateMachine,
  S extends AnyInterpreter = InterpreterFrom<M>
> = WritableAtom<AtomReturn<M, S>, AtomArguments<M, S>, void>;

export function atomWithMachine<
  M extends AnyStateMachine,
  S extends AnyInterpreter = InterpreterFrom<M>
>(
  getMachine: M | ((get: Getter) => M),
  getOptions?: InterpreterOptions<M> | ((get: Getter) => InterpreterOptions<M>)
): AtomWithMachine<M, S> {
  type Payload = AtomReturn<M, S>;
  const cachedMachineAtom = atom<CachedMachineItem<M, S> | null>(null);
  const cachedMachineStateAtom = atom<Payload | null>(null);

  function getOptionsSafe(get: Getter) {
    let initializing = true;
    const safeGet: typeof get = (...args) => {
      if (initializing) {
        return get(...args);
      }
      throw new Error('get not allowed after initialization');
    };
    const machine = isGetter(getMachine) ? getMachine(safeGet) : getMachine;
    const options = isGetter(getOptions) ? getOptions(safeGet) : getOptions;
    initializing = false;
    return { machine, options };
  }

  function startService(get: Getter, service: S) {
    const { options } = getOptionsSafe(get);
    const rehydratedState = options?.state;
    service.start(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehydratedState ? (State.create(rehydratedState) as any) : undefined
    );
  }

  const machineAtom = atom(
    (get) => {
      const cachedMachine = get(cachedMachineAtom);
      if (cachedMachine) {
        return cachedMachine;
      }
      const { machine, options } = getOptionsSafe(get);
      const newMachine = setMachine(machine, options) as M;
      const service = createIdleService(newMachine, options) as S;
      const state = service.getSnapshot();
      return { state, machine: newMachine, service };
    },
    (get, set) => {
      set(cachedMachineAtom, get(machineAtom));
    }
  );

  machineAtom.onMount = (commit) => {
    commit();
  };

  const machineItemAtom = atom(
    (get) => {
      const cache = get(cachedMachineStateAtom);
      if (cache) return cache as Payload;
      return get(machineAtom) as Payload;
    },
    (get, set, registerCleanup: (cleanup: () => void) => void) => {
      const { service, machine } = get(machineAtom);
      const sub = service.subscribe((state) => {
        const payload = { state, service, machine };
        set(cachedMachineStateAtom, payload as Payload);
      });
      startService(get, service);
      registerCleanup(() => {
        const { service } = get(machineAtom);
        service.stop();
        sub.unsubscribe();
      });
    }
  );

  machineItemAtom.onMount = (initialize) => {
    let unsub: (() => void) | undefined | false;

    initialize((cleanup) => {
      if (unsub === false) {
        cleanup();
      } else {
        unsub = cleanup;
      }
    });

    return () => {
      if (unsub) {
        unsub();
      }
      unsub = false;
    };
  };

  const machineStateWithServiceAtom = atom(
    (get) => get(machineItemAtom),
    (
      get,
      set,
      event: Parameters<AnyInterpreter['send']>[0] | typeof RESTART
    ) => {
      const { service, machine } = get(machineAtom);
      if (event === RESTART) {
        service.stop();
        set(cachedMachineAtom, null);
        set(machineAtom);
        const { service: newService } = get(machineAtom);
        newService.onChange((state) => {
          const payload = { state, service, machine };
          set(cachedMachineStateAtom, payload as Payload);
        });
        startService(get, service);
      } else {
        service.send(event);
      }
    }
  );

  return machineStateWithServiceAtom;
}

function isGetter<T>(v: T | ((get: Getter) => T)): v is (get: Getter) => T {
  return typeof v === 'function';
}
