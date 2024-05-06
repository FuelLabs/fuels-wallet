import { useCallback } from 'react';
import { IS_CRX, VITE_FUEL_FAUCET_URL } from '~/config';
import { useAccounts } from '~/systems/Account';
import { openTab } from '~/systems/CRX/utils';
import { stringifyUrl } from '~/systems/Core';

export function useOpenFaucet() {
  const { account } = useAccounts();

  const openFaucet = useCallback(() => {
    const url = stringifyUrl(VITE_FUEL_FAUCET_URL, {
      address: account?.address,
    });

    if (IS_CRX) {
      openTab(url);
      return;
    }

    window.open(url, '_blank');
  }, [account]);

  return openFaucet;
}
