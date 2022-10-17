import { useInterpret, useSelector } from '@xstate/react';
import { useCallback, useEffect } from 'react';

import type { ApplicationMachineState } from '../machines';
import { applicationMachine } from '../machines';

import { RPCService } from '~/systems/Core/services/RPCService';
import { waitForState } from '~/systems/Core/utils/machine';

const selectors = {
  isConnecting: (state: ApplicationMachineState) => {
    return state.hasTag('connecting');
  },
};

export function useApplication() {
  const applicationService = useInterpret(() => applicationMachine);
  const isConnecting = useSelector(applicationService, selectors.isConnecting);

  useEffect(() => {
    const rpcService = new RPCService();
    rpcService.server.addMethod('requestAuthorization', async (params: any) => {
      if (!params?.origin) return false;

      applicationService.send('connect', {
        data: {
          origin: params.origin,
        },
      });
      const app = await waitForState(
        applicationService,
        'connected',
        'disconnected'
      );

      return app.isConnected;
    });
    return () => rpcService.destroy();
  }, [applicationService]);

  const authorizeApplication = useCallback((accounts: Array<string>) => {
    applicationService.send({
      type: 'authorize',
      data: accounts,
    });
  }, []);

  return {
    isConnecting,
    authorizeApplication,
  };
}
