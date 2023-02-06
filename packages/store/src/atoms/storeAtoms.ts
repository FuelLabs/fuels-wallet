import { atomFamily, loadable } from 'jotai/utils';
import { createStore, atom } from 'jotai/vanilla';
import type { AnyInterpreter, AnyStateMachine, InterpreterFrom } from 'xstate';
import { toObserver } from 'xstate';

import type {
  MachinesObj,
  AddMachineInput,
  AddMachineParams,
  Listener,
  StateItem,
  ValueOf,
  Service,
  StoreServiceObj,
  WaitForArgs,
} from '../types';
import { updateService, waitFor } from '../utils';

import { atomWithMachine } from './atomWithMachine';
import { atomWithSubcription } from './atomWithSubscription';

type MachinesAtomObj<
  M extends AnyStateMachine = AnyStateMachine,
  S extends AnyInterpreter = InterpreterFrom<M>
> = Record<string, ReturnType<typeof atomWithMachine<M, S>>>;

export type JotaiStore = ReturnType<typeof createStore>;
export type CreateStoreAtomsReturn<T extends MachinesObj = MachinesObj> =
  ReturnType<typeof createStoreAtoms<T>>;

/**
 * Creates atoms to store machines.
 * @returns An object with atoms to store machines.
 * - `machinesAtom`: An atom to store the machines.
 * - `keysAtom`: An atom to get the keys of the machines.
 * - `serviceAtom`: An atom family to get an service from a machine.
 * - `onStateChangeAtom`: An atom to subscribe to state changes.
 * - `stateAtom`: An atom family to get the state of a machine.
 */
export function createStoreAtoms<T extends MachinesObj = MachinesObj>() {
  type Input = AddMachineInput<T>;
  type TMachine = ValueOf<T>;
  type TService = InterpreterFrom<ValueOf<T>>;
  type Obj = MachinesAtomObj<TMachine, TService>;
  const store = createStore();

  /**
   * An atom to store the machines and their services.
   * @returns An atom to store the machines.
   * @example
   * store.set(machinesAtom, {
   *   key: 'conter',
   *   getMachine: counterMachine,
   *   getOptions: {},
   *   hasStorage: false
   * })
   */
  const machinesObjAtom = atom<Obj>({});
  const machinesAtom = atom(
    (get) => get(machinesObjAtom),
    (get, set, input: Input) => {
      const curr = get(machinesObjAtom);
      const key = input.key.toString();
      const machineAtom = atomWithMachine({ ...input, key });
      const machinesObj = { ...curr, [input.key]: machineAtom };
      set(machinesObjAtom, machinesObj);
      return machinesObj;
    }
  );

  /**
   * An atom to get the keys of the machines.
   * @returns An atom to get the keys of the machines.
   * @example
   * const keys = useAtom(keysAtom);
   */
  const keysAtom = atom<(keyof T)[]>((get) => {
    const items = get(machinesObjAtom);
    return Object.keys(items) satisfies (keyof T)[];
  });

  /**
   * An atom family to get an service from a machine.
   * @param key The key of the machine.
   * @returns An atom to get the service of a machine.
   * @example
   * const [service, updateService] = useAtom(serviceAtom('counter'));
   */
  const serviceAtom = atomFamily((key: keyof T) => {
    return atom(
      (get) => {
        const machineAtom = get(machinesAtom)[key.toString()];
        const service = get(machineAtom).service;
        if (!service) {
          throw new Error(`Service ${key.toString()} does not exist`);
        }
        return service;
      },
      (get, _set, opts: AddMachineParams<T>[2]) => {
        const machineAtom = get(machinesAtom)[key.toString()];
        const serviceAtom = get(machineAtom).atoms.service;
        const service = get(serviceAtom);
        updateService(service, opts);
      }
    );
  });

  /**
   * An atom to get the services of the machines.
   * @returns An atom to get the services of the machines.
   * @example
   * const services = useAtom(servicesAtom);
   * const counterService = services.counter;
   */
  const servicesAtom = atom((get) => {
    const keys = get(keysAtom);
    return keys.reduce((acc, key) => {
      const service = get(serviceAtom(key));
      return { ...acc, [key]: service };
    }, {} as StoreServiceObj<T>);
  });

  /**
   * An atom to use waitFor method from XState inside a component.
   * @param params WaitForParams<T> - The params to use waitFor method.
   * @returns an loadable atom that can be used with useAtom.
   * @example
   * const [state, send] = useAtom(waitForAtom({ key: 'counter', state: 'idle' }));
   */
  function waitForAtom<K extends keyof T>(
    ...[key, givenState, timeout]: WaitForArgs<T, K>
  ) {
    const asyncAtom = atom(async (get) => {
      const service = get(serviceAtom(key)) as InterpreterFrom<T[K]>;
      return waitFor<T>(service, givenState, timeout);
    });
    return loadable(asyncAtom);
  }

  /**
   * An atom family to get the state of a machine.
   * @param key The key of the machine.
   * @returns The state of the machine.
   * @example
   * const [state, send] = useAtom(stateAtom('counter'));
   */
  const stateAtom = atomFamily((key: keyof T) => {
    return atom(
      (get) => {
        const machineAtom = get(machinesAtom)[key.toString()];
        return get(get(machineAtom).atoms.state);
      },
      (get, _set, ev: Parameters<Service<T>['send']>[0]) => {
        const machineAtom = get(machinesAtom)[key.toString()];
        const serviceAtom = get(machineAtom).atoms.service;
        const service = get(serviceAtom);
        service.send(ev);
      }
    );
  });

  /**
   * An atom to subscribe to state changes.
   * @returns An atom to subscribe to state changes.
   * @example
   * store.set(onStateChangeAtom, {
   *   type: 'subscribe',
   *   input: {
   *     key: 'counter',
   *     listener: (state) => {
   *       console.log(state);
   *     }
   *   }
   * })
   */
  const onStateChangeAtom = atomWithSubcription<null, Listener>(
    null,
    (get, _set, cleanup, action) => {
      if (!action.input) return;
      const { key, listener } = action.input;
      const service = get(serviceAtom(key));
      cleanup(
        service.subscribe(
          toObserver((state) => {
            listener(state as StateItem<T>);
          })
        )
      );
    }
  );

  /**
   * An atom to subscribe to store start.
   * @returns An atom to subscribe to store start.
   * @example
   * store.set(onStoreStartAtom, {
   *   type: 'subscribe',
   *   input: () => {
   *     console.log('store started');
   *   }
   * })
   */
  const onStoreStartAtom = atomWithSubcription<null, Listener['listener']>(
    null,
    (_get, _set, _cleanup, { input: listener }) => {
      listener?.();
    }
  );

  return {
    store,
    keysAtom,
    machinesAtom,
    serviceAtom,
    servicesAtom,
    stateAtom,
    waitForAtom,
    onStateChangeAtom,
    onStoreStartAtom,
  };
}
