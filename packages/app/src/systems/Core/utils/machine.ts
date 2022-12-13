/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyInterpreter, StateFrom, Action, AnyEventObject } from 'xstate';
import { assign } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { assocPath, mergeRight, pathOr } from './helpers';

export async function waitForState<
  I extends AnyInterpreter,
  T extends StateFrom<I['machine']>,
  D extends I['machine']['__TResolvedTypesMeta']['resolved']['matchesStates'],
  FK extends keyof T['context']
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
      {
        timeout,
      }
    );

    if (appState.matches(failureState)) {
      throw new Error(appState.context[failureMessageField], {
        cause: 'CustomState',
      });
    }

    return appState.context as T['context'];
  } catch (err: any) {
    if (err.cause === 'CustomState') throw err;
    throw new Error(
      `Window closed by inactivity after ${timeout / 1000 / 60} minutes!`
    );
  }
}

export function assignErrorMessage(message: string): Action<any, any> {
  return assign((ctx: any) => ({
    ...ctx,
    error: message,
  }));
}

export function assignWith<
  C extends Record<string, unknown> = any,
  E extends AnyEventObject = AnyEventObject,
  P = any
>(
  path: string,
  prop: P extends string ? string : (c: C, E: E) => any,
  merge?: boolean
) {
  return assign<C, E>((ctx, ev) => {
    const value = typeof prop === 'string' ? ev[prop] : ev[prop(ctx, ev)];
    const old = pathOr(ctx, path);
    const next = merge ? mergeRight(old, value) : value;
    return assocPath(ctx, path, next);
  });
}
export function assignWithInput<
  C extends Record<string, any> = any,
  E extends AnyEventObject = AnyEventObject
>(path: string, merge?: boolean) {
  return assignWith<C, E>(path, 'input', merge);
}
export function assignWithData<
  C extends Record<string, any> = any,
  E extends AnyEventObject = AnyEventObject
>(path: string, merge?: boolean) {
  return assignWith<C, E>(path, 'data', merge);
}

export function assignErrors<
  C extends Record<string, any> = any,
  E extends AnyEventObject = AnyEventObject
>(prop: string) {
  return assign<C, E>((ctx, ev) => {
    const error = ev.data.error;
    return assocPath(ctx, `errors.${prop}`, error);
  });
}

export function resetContext<
  C extends Record<string, any> = any,
  E extends AnyEventObject = AnyEventObject
>() {
  return assign((_ctx: C, _ev: E) => ({}));
}
