import { atom } from 'jotai';

import type { MachinesObj, StoreServiceObj } from '../types';

import type { KeysAtom } from './keysAtom';
import type { ServiceAtom } from './serviceAtom';

/**
 * An atom to get the services of the machines.
 * @returns An atom to get the services of the machines.
 * @example
 * const services = useAtom(servicesAtom);
 * const counterService = services.counter;
 */
export function createServicesAtom<T extends MachinesObj>(
  keysAtom: KeysAtom<T>,
  serviceAtom: ServiceAtom<T>
) {
  return atom((get) => {
    const keys = get(keysAtom);
    return keys.reduce((acc, key) => {
      const service = get(serviceAtom(key));
      return { ...acc, [key]: service };
    }, {} as StoreServiceObj<T>);
  });
}
export type ServicesAtom<T extends MachinesObj> = ReturnType<
  typeof createServicesAtom<T>
>;
