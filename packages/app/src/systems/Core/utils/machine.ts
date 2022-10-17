/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActorRef } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

export async function waitForState<TActorRef extends ActorRef<any, any>>(
  actor: TActorRef,
  done: string,
  failure: string,
  timeout: number = 60 * 5 * 1000
) {
  try {
    const appState: any = await waitFor(
      actor,
      (state) =>
        (state as any).matches(done) || (state as any).matches(failure),
      {
        timeout,
      }
    );
    return appState.context;
  } catch (err: any) {
    window.close();
    throw new Error(
      `Window closed by inactivity after ${timeout / 1000 / 60} minutes!`
    );
  }
}
