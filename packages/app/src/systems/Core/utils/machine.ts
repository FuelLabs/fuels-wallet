import type { AnyInterpreter, StateFrom } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

export async function waitForState<
  I extends AnyInterpreter,
  T extends StateFrom<I['machine']>,
  D extends I['machine']['__TResolvedTypesMeta']['resolved']['matchesStates'],
  FK extends keyof T['context']
>(
  service: I,
  done: D,
  failure: D,
  failureMessage?: FK,
  timeout: number = 60 * 5 * 1000
) {
  try {
    const appState: T = await waitFor<I>(
      service,
      (state: T) => state.matches(done) || state.matches(failure),
      {
        timeout,
      }
    );

    if (appState.matches(failure)) {
      throw new Error(appState.context[failureMessage || failure], {
        cause: 'CustomState',
      });
    }

    return appState.context as T['context'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.cause === 'CustomState') throw err;
    throw new Error(
      `Window closed by inactivity after ${timeout / 1000 / 60} minutes!`
    );
  }
}
