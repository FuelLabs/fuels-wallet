import { atomFamily, loadable } from 'jotai/utils';
import { createStore as createJotaiStore, atom } from 'jotai/vanilla';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { toObserver } from 'xstate';

import type {
  MachinesObj,
  Listener,
  StateItem,
  Service,
  StoreServiceObj,
  StateListener,
  AddMachineInput,
} from '../types';
import { updateService, waitFor } from '../utils';

import { atomWithMachine } from './atomWithMachine';
import { atomWithSubcription } from './atomWithSubscription';

export type JotaiStore = ReturnType<typeof createJotaiStore>;
export type CreateStoreAtomsReturn<T extends MachinesObj = MachinesObj> =
  ReturnType<typeof createStoreAtoms<T>>;

/**
 * Creates atoms to store machines.
 * @param id The id of the store.
 * @returns An object with atoms to store machines.
 *   - `store`: The global store.
 *   - `keysAtom`: An atom to get the keys of the machines.
 *   - `machinesAtom`: An atom to store the machines.
 *   - `serviceAtom`: An atom family to get an service from a machine.
 *   - `servicesAtom`: An atom to get all the services.
 *   - `stateAtom`: An atom family to get the state of a machine.
 *   - `waitForAtom`: An atom family to wait for a machine to reach a state.
 *   - `onStateChangeAtom`: An atom family to listen to state changes.
 *   - `onStoreStartAtom`: An atom to listen to the store start.
 */
export function createStoreAtoms<T extends MachinesObj = MachinesObj>(
  id: string
) {
  type Obj = {
    [K in keyof T]: ReturnType<
      typeof atomWithMachine<T[K], InterpreterFrom<T[K]>>
    >;
  };
  const store = createGlobalStore(id);

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
  const machinesObjAtom = atom<Obj>({} as Obj);
  const machinesAtom = atom(
    (get) => get(machinesObjAtom),
    (get, set, input: AddMachineInput<T, keyof T>) => {
      const curr = get(machinesObjAtom);
      const machineAtom = atomWithMachine(input);
      const machinesObj = { ...curr, [input.key]: machineAtom };
      set(machinesObjAtom, machinesObj);
      return machinesObj as Obj;
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
  function serviceAtom<K extends keyof T>(key: K) {
    return atom(
      (get) => {
        const machineAtom = get(machinesAtom)[key];
        const service = get(machineAtom).service as InterpreterFrom<T[K]>;
        if (!service) {
          throw new Error(`Service ${key} does not exist`);
        }
        return service;
      },
      (get, _set, opts: AddMachineInput<T, K>['getOptions'] = {}) => {
        const machineAtom = get(machinesAtom)[key];
        const serviceAtom = get(machineAtom).atoms.service;
        const service = get(serviceAtom) as InterpreterFrom<T[K]>;
        if (!service) {
          throw new Error(`Service ${key} does not exist`);
        }
        updateService(service, opts);
        return service;
      }
    );
  }

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
   * @param key The key of the machine.
   * @param givenState - a predicate function that returns a boolean
   * @param timeout The timeout to wait for.
   * @returns an loadable atom that can be used with useAtom.
   * @example
   * const [state, send] = useAtom(waitForAtom({ key: 'counter', state: 'idle' }));
   */
  function waitForAtom<K extends keyof T>(
    key: K,
    givenState: (state: StateFrom<T[K]>) => boolean,
    timeout?: number
  ) {
    return loadable(
      atom(async (get) => {
        const service = get(serviceAtom(key));
        return waitFor(service, givenState, timeout);
      })
    );
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
        const machineAtom = get(machinesAtom)[key];
        return get(get(machineAtom).atoms.state);
      },
      (get, _set, ev: Parameters<Service<T>['send']>[0]) => {
        const service = get(serviceAtom(key));
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
  const onStateChangeAtom = atomWithSubcription<
    null,
    StateListener<Service<T>, [StateItem<T>]>
  >(null, (_get, _set, cleanup, action) => {
    if (!action.input) return;
    const { service, listener } = action.input;
    cleanup(
      service.subscribe(
        toObserver((state) => {
          listener(state as StateItem<T>);
        })
      )
    );
  });

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
  const onStoreStartAtom = atomWithSubcription<null, Listener>(
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

const stores = new Map<string, JotaiStore>();
/**
 * If a store exist in the global store map, return it.
 * Otherwise, create a new store and add it to the map.
 * @param id The id of the store.
 * @returns The store.
 * @example
 * const store = createGlobalStore('myStore');
 */
function createGlobalStore<S extends JotaiStore>(id: string) {
  if (stores.has(id)) return stores.get(id) as S;
  const store = createJotaiStore();
  stores.set(id, store);
  return store;
}
