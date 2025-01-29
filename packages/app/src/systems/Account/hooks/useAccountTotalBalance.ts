import { Services, store } from '~/store';
import type { AccountsMachineState } from '../machines';

const selectors = {
  totalBalanceUsd(state: AccountsMachineState) {
    return state.context.account?.totalBalanceInUsd;
  },
};

/**
 * @returns The current account's total balance in USD
 */
export function useAccountTotalBalance() {
  return store.useSelector(Services.accounts, selectors.totalBalanceUsd);
}
