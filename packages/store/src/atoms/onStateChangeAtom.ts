import type { InterpreterFrom, StateFrom, AnyStateMachine } from 'xstate';
import { toObserver } from 'xstate';

import type { MachinesObj } from '../types';

import { atomWithSubscription } from './atomWithSubscription';

/**
 * Create an atom to subscribe to state changes.
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
export function createOnStateChangeAtom<T extends MachinesObj>() {
  type Input = {
    service: InterpreterFrom<T[keyof T]>;
    listener: <S extends StateFrom<AnyStateMachine>>(state: S) => void;
  };
  return atomWithSubscription<null, Input>(null, (_get, _set, input) => {
    const { service, listener } = input;
    const sub = service.subscribe(toObserver(listener));
    return sub.unsubscribe;
  });
}
export type OnStateChangeAtom<T extends MachinesObj> = ReturnType<
  typeof createOnStateChangeAtom<T>
>;
