/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Getter, WritableAtom } from 'jotai/vanilla';
import { atom } from 'jotai/vanilla';

/**
 * An atom that attaches handle subscriptions logic.
 * @param subscribe - A function that takes a `get` function, a `set`,
 * an input and returns a function that unsubscribes.
 * @returns An atom that attaches handle subscriptions logic.
 * @example
 * const countAtom = atom(0)
 * const subscriptionAtom = atomWithSubscription((get, set, input: number) => {
 *   const id = setInterval(() => {
 *     set(countAtom, (count) => count + input)
 *   }, 1000)
 *   return () => {
 *     clearInterval(id)
 *   }
 * })
 */
type Return<Value, Input> = WritableAtom<Value, [input: Input], void>;
type WriteArgs<Value, Input> = Parameters<Return<Value, Input>['write']>;

export function atomWithSubscription<Value, Input>(
  getter: ((get: Getter) => Value) | null,
  subscribe: (...args: WriteArgs<Value, Input>) => void
): Return<Value, Input>;
export function atomWithSubscription<Value, Input>(
  getter: ((get: Getter) => Value) | null,
  subscribe: (...args: WriteArgs<Value, Input>) => () => void
): Return<Value, Input>;
export function atomWithSubscription<Value, Input>(
  getter: ((get: Getter) => Value) | null,
  subscribe: (...args: WriteArgs<Value, Input>) => unknown
) {
  const subs = new Set<() => void>([]);
  const subscriptionAtom = atom<Value, [Input], void>(
    getter as any,
    (get, set, action) => {
      if (!action) return;
      const sub = subscribe(get, set, action);
      sub && subs.add(sub as any);
    }
  );
  subscriptionAtom.onMount = (init) => {
    init({} as any);
    return () => {
      subs.forEach((sub) => sub());
      subs.clear();
    };
  };
  return subscriptionAtom;
}
