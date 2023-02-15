import { useSelector } from '@xstate/react';

import type { AddAssetMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  origin: (state: AddAssetMachineState) => state.context.origin,
  asset: (state: AddAssetMachineState) => state.context.asset,
};

export function useAddAssetRequest() {
  const service = store.useService(Services.addAssetRequest);
  const { send } = service;
  const asset = useSelector(service, selectors.asset);
  const origin = useSelector(service, selectors.origin);

  function addAsset() {
    send('ADD_ASSET');
  }

  function reject() {
    send('REJECT');
  }

  return {
    handlers: {
      addAsset,
      reject,
    },
    origin,
    asset,
  };
}
