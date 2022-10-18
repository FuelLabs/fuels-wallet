import { useInterpret, useSelector } from '@xstate/react';
import { useCallback, useEffect } from 'react';

import type { AppConnectMachineState } from '../machines';
import { appConnectMachine } from '../machines';
import { AppConnectExternal } from '../methods';

import { IS_CRX_POPUP } from '~/config';

const selectors = {
  isConnecting: (state: AppConnectMachineState) => {
    return state.hasTag('connecting');
  },
  origin: (state: AppConnectMachineState) => {
    return state.context.origin;
  },
};

export function useAppConnect() {
  const applicationService = useInterpret(() => appConnectMachine);
  const isConnecting = useSelector(applicationService, selectors.isConnecting);
  const origin = useSelector(applicationService, selectors.origin);

  useEffect(() => {
    if (IS_CRX_POPUP) {
      AppConnectExternal.start(applicationService);
    }
  }, [appConnectMachine]);

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
