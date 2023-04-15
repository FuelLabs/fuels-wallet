import type { AbisMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  abiMap: (state: AbisMachineState) => state.context.abiMap,
};

export function useAbiMap() {
  const abiMap = store.useSelector(Services.abis, selectors.abiMap);

  return {
    abiMap,
  };
}
