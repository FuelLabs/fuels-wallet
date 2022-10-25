import { ExtensionPageConnection } from '@fuels-wallet/sdk';

import type { AppConnectMachineService } from './machines';

import { waitForState } from '~/systems/Core/utils/machine';

export class AppConnectExternal extends ExtensionPageConnection {
  readonly service: AppConnectMachineService;

  constructor(service: AppConnectMachineService) {
    super();
    this.service = service;
    super.externalMethods([this.requestAuthorization]);
  }

  static start(service: AppConnectMachineService) {
    return new AppConnectExternal(service);
  }

  async requestAuthorization({ origin }: { origin: string }) {
    this.service.send('CONNECT', {
      input: origin,
    });
    const app = await waitForState(this.service, 'connected', 'error');
    return app.isConnected;
  }
}
