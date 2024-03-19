import type { Action, AnyInterpreter, StateFrom } from 'xstate';
import { assign } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

export async function waitForState<
  I extends AnyInterpreter,
  T extends StateFrom<I['machine']>,
  D extends I['machine']['__TResolvedTypesMeta']['resolved']['matchesStates'],
  FK extends keyof T['context'],
>(
  service: I,
  done?: D,
  failure?: D,
  failureMessage?: FK,
  timeout: number = 60 * 5 * 1000
) {
  try {
    const doneState = done || 'done';
    const failureState = failure || 'failed';
    const failureMessageField = failureMessage || 'error';

    const appState: T = await waitFor<I>(
      service,
      (state: T) => state.matches(doneState) || state.matches(failureState),
      { timeout }
    );

    if (appState.matches(failureState)) {
      throw new Error(appState.context[failureMessageField], {
        cause: 'CustomState',
      });
    }

    return appState.context as T['context'];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (err: any) {
    if (err.cause === 'CustomState') throw err;
    throw new Error(
      `Window closed by inactivity after ${timeout / 1000 / 60} minutes!`
    );
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assignError(): Action<any, any> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return assign((ctx: any, ev: any) => ({
    ...ctx,
    error: ev.data.error.message,
  }));
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function assignErrorMessage(message: string): Action<any, any> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return assign((ctx: any) => ({
    ...ctx,
    error: message,
  }));
}
