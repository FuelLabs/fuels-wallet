import { atom } from 'jotai';

import type { MachinesObj } from '../types';

import type { MachinesAtom } from './machinesAtom';

/**
 * Create an atom to get the keys of the machines.
 * @returns An atom to get the keys of the machines.
 * @example
 * const keys = useAtom(keysAtom);
 */
export function createKeysAtom<T extends MachinesObj>(
  machinesAtom: MachinesAtom<T>
) {
  return atom<(keyof T)[]>((get) => {
    const items = get(machinesAtom);
    return Object.keys(items);
  });
}
export type KeysAtom<T extends MachinesObj> = ReturnType<
  typeof createKeysAtom<T>
>;
