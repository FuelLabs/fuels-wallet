/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WritableAtom } from 'jotai/vanilla';
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
type Return<I> = WritableAtom<null, [input: I], void>;
type Args<I> = Parameters<Return<I>['write']>;

export function atomWithSubscription<I>(
  subscribe: (...[get, set, input]: Args<I>) => void
): Return<I>;
export function atomWithSubscription<I>(
  subscribe: (...[get, set, input]: Args<I>) => () => void
): Return<I>;
export function atomWithSubscription<I>(
  subscribe: (...[get, set, input]: Args<I>) => unknown
) {
  const subs = new Set<() => void>([]);
  const subscriptionAtom = atom(null, (...args: Args<I>) => {
    const sub = subscribe(...args) as () => void | undefined;
    if (typeof sub !== 'undefined') {
      subs.add(sub);
    }
  });
  subscriptionAtom.onMount = (init) => {
    init({} as any);
    return () => {
      subs.forEach((sub) => sub());
      subs.clear();
    };
  };
  return subscriptionAtom;
}
