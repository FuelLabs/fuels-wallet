import { ExtensionPageConnection } from '@fuel-wallet/sdk';
import { useEffect } from 'react';

import type { SignMachineService } from '../machines';

import { IS_CRX_POPUP } from '~/config';
import { waitForState } from '~/systems/Core';

export class SignRequestMethods extends ExtensionPageConnection {
  readonly service: SignMachineService;

  constructor(service: SignMachineService) {
    super();
    this.service = service;
    super.externalMethods([this.signMessage]);
  }

  static start(service: SignMachineService) {
    return new SignRequestMethods(service);
  }

  async signMessage({ origin, message }: { origin: string; message: string }) {
    this.service.send('START_SIGN', {
      input: { origin, message },
    });
    const state = await waitForState(this.service);
    return state.signedMessage;
  }
}

export function useSignRequestMethods(service: SignMachineService) {
  useEffect(() => {
    if (IS_CRX_POPUP) {
      SignRequestMethods.start(service);
    }
  }, [service]);
}
