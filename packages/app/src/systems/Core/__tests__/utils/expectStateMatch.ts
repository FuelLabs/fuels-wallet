import type { AnyInterpreter, StateFrom } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

export async function expectStateMatch<
  I extends AnyInterpreter,
  T extends StateFrom<I['machine']>,
  D extends I['machine']['__TResolvedTypesMeta']['resolved']['matchesStates'],
>(service: I, stateName: D) {
  const state: T = await waitFor(service, (state: T) =>
    state.matches(stateName)
  );
  expect(state.matches(stateName)).toBeTruthy();
  return state;
}
