import { useSelector } from '@xstate/react';
import { Services, store } from '~/store';

import type { AddAssetMachineState } from '../machines';

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

  function approve() {
    send('APPROVE');
  }

  function reject() {
    send('REJECT');
  }

  return {
    handlers: {
      approve,
      reject,
    },
    origin,
    assets,
    title,
    favIconUrl,
  };
}
