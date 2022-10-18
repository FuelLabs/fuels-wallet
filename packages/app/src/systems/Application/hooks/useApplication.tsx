import { useInterpret, useSelector } from '@xstate/react';
import { useCallback } from 'react';

import type { ApplicationMachineState } from '../machines';
import { applicationMachine } from '../machines';

import { useApplicationRPC } from './useApplicationRPC';

const selectors = {
  isConnecting: (state: ApplicationMachineState) => {
    return state.hasTag('connecting');
  },
  origin: (state: ApplicationMachineState) => {
    return state.context.origin;
  },
};

export function useApplication() {
  const applicationService = useInterpret(() => applicationMachine);
  const isConnecting = useSelector(applicationService, selectors.isConnecting);
  const origin = useSelector(applicationService, selectors.origin);

  useApplicationRPC(applicationService);

  const authorizeApplication = useCallback((accounts: Array<string>) => {
    applicationService.send({
      type: 'authorize',
      data: accounts,
    });
  }, []);

  return {
    origin,
    isConnecting,
    authorizeApplication,
  };
}
