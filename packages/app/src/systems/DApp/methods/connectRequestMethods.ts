import { ExtensionPageConnection } from '@fuels-wallet/sdk';
import { useEffect } from 'react';

import type { ConnectMachineService } from '../machines';

import { IS_CRX_POPUP } from '~/config';
import { waitForState } from '~/systems/Core/utils/machine';

export class ConnectRequestMethods extends ExtensionPageConnection {
  constructor(readonly service: ConnectMachineService) {
    super();
    super.externalMethods([this.requestConnection]);
  }

  static start(service: ConnectMachineService) {
    return new ConnectRequestMethods(service);
  }

  async requestConnection({ origin }: { origin: string }) {
    this.service.send('CONNECT', {
      input: origin,
    });
    const app = await waitForState(this.service, 'connected', 'error');
    return !!app;
  }
}

export function useConnectRequestMethods(service: ConnectMachineService) {
  useEffect(() => {
    if (IS_CRX_POPUP) {
      ConnectRequestMethods.start(service);
    }
  }, [service]);
}
