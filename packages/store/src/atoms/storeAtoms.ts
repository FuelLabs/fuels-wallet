import { createStore as createJotaiStore } from 'jotai/vanilla';

import type { MachinesObj } from '../types';

import { createKeysAtom } from './keysAtom';
import { createMachinesAtom } from './machinesAtom';
import { createOnStateChangeAtom } from './onStateChangeAtom';
import { createStoreStartAtom } from './onStoreStartAtom';
import { createServiceAtom } from './serviceAtom';
import { createServicesAtom } from './servicesAtom';
import { createStateAtom } from './stateAtom';
import { createWaitForAtom } from './waitForAtom';

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
export function createStoreAtoms<T extends MachinesObj>(id: string) {
  const store = createGlobalStore(id);
  const machinesAtom = createMachinesAtom<T>();
  const keysAtom = createKeysAtom(machinesAtom);
  const serviceAtom = createServiceAtom(machinesAtom);
  const servicesAtom = createServicesAtom(keysAtom, serviceAtom);
  const waitForAtom = createWaitForAtom(serviceAtom);
  const stateAtom = createStateAtom(machinesAtom, serviceAtom);
  const onStateChangeAtom = createOnStateChangeAtom<T>();
  const onStoreStartAtom = createStoreStartAtom();
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
