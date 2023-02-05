import type { Atom } from 'jotai';
import { atom, createStore } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { atomWithMachine } from './atomWithMachine';
import type {
  MachinesObj,
  AddMachineInput,
  MachineItemObj,
  Service,
  AddMachineParams,
} from './types';
import { updateService } from './xstate';

export type CreateStoreAtomsReturn<T extends MachinesObj> = ReturnType<
  typeof createStoreAtoms<T>
>;

export function createStoreAtoms<T extends MachinesObj>() {
  type Args = [AddMachineInput<T>];
  type Obj = MachineItemObj<T>;

  const store = createStore();
  /**
   * Atoms to store the machines.
   */
  const machinesObjAtom = atom<Obj>({} as Obj);
  const machinesAtom = atom<Obj, Args, void>(
    (get) => get(machinesObjAtom),
    (get, set, ...[input]) => {
      const { key, machine, opts } = input;
      const curr = get(machinesObjAtom);
      set(machinesObjAtom, { ...curr, [key]: atomWithMachine(machine, opts) });
    }
  );

  /**
   * An atom to get the keys of the machines.
   */
  const keysAtom = atom<(keyof T)[]>((get) => {
    const items = get(machinesObjAtom);
    return Object.keys(items) satisfies (keyof T)[];
  });

  /**
   * An atom family to get an service from a machine.
   */
  const serviceAtom = atomFamily<keyof T, Atom<Service<T>>>((key) =>
    atom((get) => {
      const machineAtom = get(machinesAtom)[key];
      const service = get(machineAtom).service;
      if (!service) {
        throw new Error(`Service ${key.toString()} does not exist`);
      }
      return service;
    })
  );

  /**
   * An atom to get all services as an object.
   */
  const servicesAtom = atom((get) => {
    const items = get(machinesObjAtom);
    return Object.entries(items).reduce((obj, [key, machineAtom]) => {
      const value = get(machineAtom);
      return { ...obj, [key]: value.service };
    }, {} as Record<keyof T, Service<T>>);
  });

  /**
   * An atom family to update an service from a machine.
   */
  const updateServiceAtom = atom(
    null,
    (get, _set, key: keyof T, opts: AddMachineParams<T>[2]) => {
      const machineAtom = get(machinesAtom)[key];
      const service = get(machineAtom).service;
      updateService(service, opts);
    }
  );

  return {
    store,
    keysAtom,
    machinesAtom,
    serviceAtom,
    servicesAtom,
    updateServiceAtom,
  };
}
