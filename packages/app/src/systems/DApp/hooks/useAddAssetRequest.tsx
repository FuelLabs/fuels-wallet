import { useSelector } from '@xstate/react';

import type { AddAssetMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  origin: (state: AddAssetMachineState) => state.context.origin,
  asset: (state: AddAssetMachineState) => state.context.asset,
  title: (state: AddAssetMachineState) => state.context.title,
  favIconUrl: (state: AddAssetMachineState) => state.context.favIconUrl,
};

export function useAddAssetRequest() {
  const service = store.useService(Services.addAssetRequest);
  const { send } = service;
  const asset = useSelector(service, selectors.asset);
  const origin = useSelector(service, selectors.origin);
  const title = useSelector(service, selectors.title);
  const favIconUrl = useSelector(service, selectors.favIconUrl);

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
    title,
    favIconUrl,
    asset,
  };
}
