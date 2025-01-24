import { Services, store } from '~/store';
import type { AccountsMachineState } from '../machines';

const selectors = {
  account(state: AccountsMachineState) {
    return state.context.account;
  },
};

export function useCurrentAccount() {
  const account = store.useSelector(Services.accounts, selectors.account);

  return {
    account,
  };
}
