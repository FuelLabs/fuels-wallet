import { atom } from 'jotai';
import type { InterpreterFrom } from 'xstate';

import type { MachinesObj, AddMachineInput } from '../types';
import { updateService } from '../utils/xstate';

import type { MachinesAtom } from './machinesAtom';

/**
 * Create an atom family to get an service from a machine.
 * @param key The key of the machine.
 * @returns An atom to get the service of a machine.
 * @example
 * const [service, updateService] = useAtom(serviceAtom('counter'));
 */
export function createServiceAtom<T extends MachinesObj>(
  machinesAtom: MachinesAtom<T>
) {
  return <K extends keyof T>(key: K) =>
    atom(
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
export type ServiceAtom<T extends MachinesObj> = ReturnType<
  typeof createServiceAtom<T>
>;
