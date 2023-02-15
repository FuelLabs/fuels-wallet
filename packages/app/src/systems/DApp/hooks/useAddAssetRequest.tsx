import { useInterpret, useSelector } from '@xstate/react';

import type { AddAssetMachineState } from '../machines';
import { addAssetMachine } from '../machines';
import { useAddAssetRequestMethods } from '../methods';

const selectors = {
  origin: (state: AddAssetMachineState) => state.context.origin,
  asset: (state: AddAssetMachineState) => state.context.asset,
};

export function useAddAssetRequest() {
  const service = useInterpret(addAssetMachine);
  const { send } = service;
  const asset = useSelector(service, selectors.asset);
  const origin = useSelector(service, selectors.origin);

  // Start Connect Request Methods
  useAddAssetRequestMethods(service);

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
