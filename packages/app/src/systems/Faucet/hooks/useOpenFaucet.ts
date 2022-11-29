import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { IS_CRX, VITE_FUEL_FAUCET_URL } from '~/config';
import { useAccount } from '~/systems/Account';
import { openTab } from '~/systems/CRX/utils';
import { Pages, stringifyUrl } from '~/systems/Core';

export function useOpenFaucet() {
  const navigate = useNavigate();
  const { account } = useAccount();

  // it's not possible to open reCaptcha inside
  // the extension for security reasons
  const openFaucet = useCallback(() => {
    if (IS_CRX) {
      const url = stringifyUrl(VITE_FUEL_FAUCET_URL, {
        address: account?.address,
      });
      openTab(url);
    } else {
      navigate(Pages.faucet());
    }
  }, [navigate]);

  return openFaucet;
}
