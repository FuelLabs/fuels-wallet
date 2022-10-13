import type { ApplicationMachineState } from '@fuels-wallet/sdk';
import { createApplicationService } from '@fuels-wallet/sdk';
import { createExtensionConnector } from '@fuels-wallet/sdk/src/events';
import { useSelector } from '@xstate/react';
import { useCallback } from 'react';

import { applicationMachine } from '../machines';

const selectors = {
  isConnecting: (state: ApplicationMachineState) => {
    return state.hasTag('connecting');
  },
};

const applicationService = createApplicationService({
  machine: applicationMachine,
  connector: createExtensionConnector({
    senderId: chrome.runtime.id,
  }),
});

export function useApplication() {
  const isConnecting = useSelector(applicationService, selectors.isConnecting);

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
