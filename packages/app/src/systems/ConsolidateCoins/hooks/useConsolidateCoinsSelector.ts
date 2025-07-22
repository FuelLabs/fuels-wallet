import { store } from '~/store';
import { Services } from '~/store';
import type { ConsolidateCoinsMachineState } from '../machines/consolidateCoinsMachine';

export const useConsolidateCoinsSelector = <T>(
  selector: (state: ConsolidateCoinsMachineState) => T
) => store.useSelector(Services.consolidateCoins, selector);
