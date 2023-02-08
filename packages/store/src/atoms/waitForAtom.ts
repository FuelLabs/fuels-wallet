import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

import type { MachinesObj, WaitForArgs } from '../types';
import { waitFor } from '../utils/xstate';

import type { ServiceAtom } from './serviceAtom';

/**
 * Create nn atom to use waitFor method from XState inside a component.
 * @param key The key of the machine.
 * @param givenState - a predicate function that returns a boolean
 * @param timeout The timeout to wait for.
 * @returns an loadable atom that can be used with useAtom.
 * @example
 * const [state, send] = useAtom(waitForAtom({ key: 'counter', state: 'idle' }));
 */
export function createWaitForAtom<T extends MachinesObj>(
  serviceAtom: ServiceAtom<T>
) {
  return <K extends keyof T>(...[key, ...args]: WaitForArgs<T, K>) => {
    return loadable(
      atom(async (get) => {
        const service = get(serviceAtom(key));
        return waitFor(service, ...args);
      })
    );
  };
}
export type WaitForAtom<T extends MachinesObj> = ReturnType<
  typeof createWaitForAtom<T>
>;
