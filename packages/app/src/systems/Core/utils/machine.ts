import type { AnyInterpreter, StateFrom } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

export async function waitForState<
  I extends AnyInterpreter,
  T extends StateFrom<I['machine']>,
  D extends I['machine']['__TResolvedTypesMeta']['resolved']['matchesStates']
>(service: I, done: D, failure: D, timeout: number = 60 * 5 * 1000) {
  try {
    const appState: T = await waitFor<I>(
      service,
      (state: T) => state.matches(done) || state.matches(failure),
      {
        timeout,
      }
    );
    return appState.context as T['context'];
  } catch (err: unknown) {
    // window.close();
    throw new Error(
      `Window closed by inactivity after ${timeout / 1000 / 60} minutes!`
    );
  }
}
