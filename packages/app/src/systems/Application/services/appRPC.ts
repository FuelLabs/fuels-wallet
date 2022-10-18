import { RPCService } from '../../Core/services/RPCService';
import type { ApplicationMachineService } from '../machines';

import { waitForState } from '~/systems/Core/utils/machine';

export class ApplicationRPC extends RPCService {
  readonly service: ApplicationMachineService;

  constructor(service: ApplicationMachineService) {
    super();
    this.service = service;
    super.setupMethods(this, ['requestAuthorization']);
  }

  async requestAuthorization({ origin }: { origin: string }) {
    this.service.send('connect', {
      data: origin,
    });
    const app = await waitForState(this.service, 'connected', 'error');
    return app.isConnected;
  }
}
