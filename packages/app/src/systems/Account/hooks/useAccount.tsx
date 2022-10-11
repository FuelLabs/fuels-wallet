import { useNavigate } from 'react-router-dom';

import type { AccountMachineState } from '../machines';

import { IS_LOCKED_KEY } from '~/config';
import { Services, store } from '~/store';
import { Pages } from '~/systems/Core';

const selectors = {
  isLoading: (state: AccountMachineState) => {
    return state.hasTag('loading');
  },
  account: (state: AccountMachineState) => {
    return state.context?.data;
  },
  isLocked: () => {
    return localStorage.getItem(IS_LOCKED_KEY);
  },
  wallet: (state: AccountMachineState) => {
    return state.context?.wallet;
  },
};

export function useAccount() {
  const service = store.useService(Services.account);
  const isLoading = store.useSelector(Services.account, selectors.isLoading);
  const account = store.useSelector(Services.account, selectors.account);
  const isLocked = store.useSelector(Services.account, selectors.isLocked);
  const wallet = store.useSelector(Services.account, selectors.wallet);
  const navigate = useNavigate();

  function unlock(password: string) {
    service.send('UNLOCK_WALLET', { input: { password, account } });
  }
  function goToUnlockPage(lastPath?: string) {
    navigate(Pages.unlock(), { state: { lastPath } });
  }

  return {
    account,
    wallet,
    isLoading,
    isLocked,
    handlers: {
      unlock,
      goToUnlockPage,
    },
  };
}
