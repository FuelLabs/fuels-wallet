import { atom } from 'jotai';
import type { InterpreterFrom } from 'xstate';

import type { MachinesObj } from '../types';

import type { MachinesAtom } from './machinesAtom';
import type { ServiceAtom } from './serviceAtom';

/**
 * Create an atom family to get the state of a machine.
 * @param key The key of the machine.
 * @returns The state of the machine.
 * @example
 * const [state, send] = useAtom(stateAtom('counter'));
 */
export function createStateAtom<T extends MachinesObj>(
  machinesAtom: MachinesAtom<T>,
  serviceAtom: ServiceAtom<T>
) {
  return <K extends keyof T>(key: keyof T) => {
    type Service = InterpreterFrom<T[K]>;
    type Event = Parameters<Service['send']>[0];
    return atom(
      (get) => {
        const machineAtom = get(machinesAtom)[key];
        return get(get(machineAtom).atoms.state);
      },
      (get, _set, ev: Event) => {
        const service = get(serviceAtom(key));
        service.send(ev);
      }
    );
  };
}
export type StateAtom<T extends MachinesObj> = ReturnType<
  typeof createStateAtom<T>
>;
