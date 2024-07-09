import { Address } from 'fuels';
import { useCallback } from 'react';
import { IS_CRX, VITE_FUEL_FAUCET_URL } from '~/config';
import { useAccounts } from '~/systems/Account';
import { openTab } from '~/systems/CRX/utils';
import { stringifyUrl } from '~/systems/Core';

export function useOpenFaucet() {
  const { account } = useAccounts();

  const openFaucet = useCallback(() => {
    if (!account || !account.address) return VITE_FUEL_FAUCET_URL;
    const address = Address.fromDynamicInput(account.address).toB256();
    const url = stringifyUrl(VITE_FUEL_FAUCET_URL, {
      address,
    });

    if (IS_CRX) {
      openTab(url);
      return;
    }

    window.open(url, '_blank');
  }, [account]);

  return openFaucet;
}
