import { useSelector } from '@xstate/react';

import type { AddAssetMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  origin: (state: AddAssetMachineState) => state.context.origin,
  assets: (state: AddAssetMachineState) => state.context.assets,
  title: (state: AddAssetMachineState) => state.context.title,
  favIconUrl: (state: AddAssetMachineState) => state.context.favIconUrl,
};

export function useAddAssetRequest() {
  const service = store.useService(Services.addAssetRequest);
  const { send } = service;
  const assets = useSelector(service, selectors.assets);
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
    assets,
    title,
    favIconUrl,
  };
}
