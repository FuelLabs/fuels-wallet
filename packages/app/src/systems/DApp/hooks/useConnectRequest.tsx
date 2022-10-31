import { useInterpret, useSelector } from '@xstate/react';

import type { ConnectMachineState } from '../machines';
import { connectMachine } from '../machines';
import { useConnectRequestMethods } from '../methods';

const selectors = {
  isConnecting: (state: ConnectMachineState) => {
    return state.matches('connecting.authorizing');
  },
  origin: (state: ConnectMachineState) => {
    return state.context.origin;
  },
};

export function useConnectRequest() {
  const connectionService = useInterpret(connectMachine);
  const isConnecting = useSelector(connectionService, selectors.isConnecting);
  const origin = useSelector(connectionService, selectors.origin);

  // Start Connect Request Methods
  useConnectRequestMethods(connectionService);

  function authorizeConnection(accounts: Array<string>) {
    connectionService.send({
      type: 'AUTHORIZE',
      input: accounts,
    });
  }

  function rejectConnection() {
    connectionService.send('REJECT');
  }

  return {
    service: connectionService,
    origin,
    isConnecting,
    handlers: {
      rejectConnection,
      authorizeConnection,
    },
  };
}
