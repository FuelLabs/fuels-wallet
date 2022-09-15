import { useMachine } from "@xstate/react";

import type { StartFaucetData } from "../machines";
import { faucetMachine } from "../machines";

export function useFaucetDialog() {
  const [, send] = useMachine(faucetMachine);

  const startFaucet = (data: StartFaucetData) => {
    send("START_FAUCET", { data });
  };

  return {
    handlers: {
      startFaucet,
    },
  };
}
