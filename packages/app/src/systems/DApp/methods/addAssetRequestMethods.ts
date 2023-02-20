import { ExtensionPageConnection } from '@fuel-wallet/sdk';
import { useEffect } from 'react';

import type { AddAssetMachineService } from '../machines';

import { IS_CRX_POPUP } from '~/config';
import type { AssetInputs } from '~/systems/Asset';
import { waitForState } from '~/systems/Core';

export class AddAssetRequestMethods extends ExtensionPageConnection {
  readonly service: AddAssetMachineService;

  constructor(service: AddAssetMachineService) {
    super();
    this.service = service;
    super.externalMethods([this.addAsset]);
  }

  static start(service: AddAssetMachineService) {
    return new AddAssetRequestMethods(service);
  }

  async addAsset(input: AssetInputs['addAsset']) {
    this.service.send('START', {
      input,
    });
    const state = await waitForState(this.service);
    return state.addedAsset;
  }
}

export function useAddAssetRequestMethods(service: AddAssetMachineService) {
  useEffect(() => {
    if (IS_CRX_POPUP) {
      AddAssetRequestMethods.start(service);
    }
  }, [service]);
}
