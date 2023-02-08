import type { Listener } from '../types';

import { atomWithSubscription } from './atomWithSubscription';

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
export function createStoreStartAtom() {
  return atomWithSubscription<null, Listener>(null, (_get, _set, listener) => {
    listener?.();
  });
}
export type OnStoreStartAtom = ReturnType<typeof createStoreStartAtom>;
