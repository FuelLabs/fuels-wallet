import { useMachine, useSelector } from "@xstate/react";
import { useNavigate } from "react-router-dom";

import type { FaucetMachineState, StartFaucetData } from "../machines";
import { faucetMachine } from "../machines";

const selectors = {
  isLoading: (state: FaucetMachineState) => state.matches("fauceting"),
  isShowingDoneFeedback: (state: FaucetMachineState) =>
    state.matches("showingDoneFeedback"),
};

export function useFaucetDialog() {
  const navigate = useNavigate();
  const [, send, service] = useMachine(
    faucetMachine.withConfig({
      actions: {
        navigateToHome: (_) => {
          navigate("/");
        },
      },
    })
  );
  const isLoading = useSelector(service, selectors.isLoading);
  const isShowingDoneFeedback = useSelector(
    service,
    selectors.isShowingDoneFeedback
  );

  const startFaucet = (data: StartFaucetData) => {
    send("START_FAUCET", { data });
  };

  return {
    handlers: {
      startFaucet,
    },
    isLoading,
    isShowingDoneFeedback,
  };
}
