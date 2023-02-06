import type { Getter, Setter } from 'jotai/vanilla';
import { atom } from 'jotai/vanilla';
import type { Subscription } from 'xstate';

type Action<Input> =
  | {
      type: 'init';
      input?: null;
    }
  | {
      type: 'unsubscribe';
      input?: null;
    }
  | {
      type: 'subscribe';
      input: Input;
    };

type CallbackFn<Input, Result> = (
  get: Getter,
  set: Setter,
  cleanup: (sub: Subscription) => Set<Subscription> | null,
  action: Action<Input>
) => Result;

/**
 * An atom that attaches handle subscriptions logic.
 * @param getter A getter function to get the initial value.
 * @param fn A callback function to handle the subscription logic.
 * @returns An atom that handles subscriptions.
 */
export function atomWithSubcription<Value, Input, Result = unknown>(
  getter: ((get: Getter) => Value) | null,
  fn: CallbackFn<Input, Result>
) {
  const firstParam = getter ? (get: Getter) => getter(get) : null;
  const subs = new Set<Subscription>([]);
  const subscriptionAtom = atom<Value, [Action<Input>], Result>(
    firstParam as never,
    (get, set, action) => {
      const cleanup = (sub?: Subscription) => (sub ? subs.add(sub) : null);
      return fn(get, set, cleanup, action);
    }
  );
  subscriptionAtom.onMount = (init) => {
    init({ type: 'init' });
    return () => {
      subs.forEach((sub) => sub.unsubscribe());
      subs.clear();
    };
  };
  return subscriptionAtom;
}
