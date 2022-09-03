import { useMachine, useSelector } from "@xstate/react";

import type { HomeMachineState } from "../machines/homeMachine";
import { homeMachine } from "../machines/homeMachine";

const selectors = {
  context: (state: HomeMachineState) => state.context,
};

export function useHome() {
  const [state, , service] = useMachine(homeMachine);

  const ctx = useSelector(service, selectors.context);

  return {
    state,
    handlers: {},
    context: {
      ...ctx,
    },
  };
}
