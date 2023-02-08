import { atom } from 'jotai';
import type { InterpreterFrom } from 'xstate';

import type { MachinesObj, AddMachineInput } from '../types';

import { atomWithMachine } from './atomWithMachine';

/**
 * Create an atom to store the machines and their services.
 * @returns An atom to store the machines.
 * @example
 * store.set(machinesAtom, {
 *   key: 'conter',
 *   getMachine: counterMachine,
 *   getOptions: {},
 *   hasStorage: false
 * })
 */
export function createMachinesAtom<T extends MachinesObj>() {
  type Obj = {
    [K in keyof T]: ReturnType<
      typeof atomWithMachine<T[K], InterpreterFrom<T[K]>>
    >;
  };
  const machinesObjAtom = atom<Obj>({} as Obj);
  return atom(
    (get) => get(machinesObjAtom),
    (get, set, input: AddMachineInput<T, keyof T>) => {
      const curr = get(machinesObjAtom);
      const machineAtom = atomWithMachine(input);
      const machinesObj = { ...curr, [input.key]: machineAtom };
      set(machinesObjAtom, machinesObj);
      return machinesObj as Obj;
    }
  );
}
export type MachinesAtom<T extends MachinesObj> = ReturnType<
  typeof createMachinesAtom<T>
>;
