import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';

import type { AppConnectMachineState } from '../machines';
import { appConnectMachine } from '../machines';
import { AppConnectExternal } from '../methods';

import { IS_CRX_POPUP } from '~/config';

const selectors = {
  isConnecting: (state: AppConnectMachineState) => {
    return state.matches('connecting');
  },
  origin: (state: AppConnectMachineState) => {
    return state.context.origin;
  },
};

export function useAppConnect() {
  const applicationService = useInterpret(appConnectMachine);
  const isConnecting = useSelector(applicationService, selectors.isConnecting);
  const origin = useSelector(applicationService, selectors.origin);

  useEffect(() => {
    if (IS_CRX_POPUP) {
      AppConnectExternal.start(applicationService);
    }
  }, [appConnectMachine]);

  function authorizeApplication(accounts: Array<string>) {
    applicationService.send({
      type: 'AUTHORIZE',
      input: accounts,
    });
  }

  return {
    origin,
    isConnecting,
    handlers: {
      authorizeApplication,
    },
  };
}
