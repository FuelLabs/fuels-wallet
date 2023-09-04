import { useMachine, useSelector } from '@xstate/react';
import { useNavigate } from 'react-router-dom';
import { Pages } from '~/systems/Core';

import type { FaucetMachineState, StartFaucetData } from '../machines';
import { faucetMachine } from '../machines';

const selectors = {
  isLoading: (state: FaucetMachineState) => state.matches('fauceting'),
};

export function useFaucetDialog() {
  const navigate = useNavigate();
  const [, send, service] = useMachine(faucetMachine, {
    actions: {
      navigateToHome: (_) => {
        navigate(Pages.wallet());
      },
    },
  });

  const isLoading = useSelector(service, selectors.isLoading);
  const startFaucet = (data: StartFaucetData) => {
    send('START_FAUCET', { data });
  };

  return {
    handlers: {
      startFaucet,
    },
    isLoading,
  };
}
