import { Address } from 'fuels';
import { useCallback, useMemo } from 'react';
import { IS_CRX } from '~/config';
import { DEFAULT_NETWORKS } from '~/networks';
import { useAccounts } from '~/systems/Account';
import { openTab } from '~/systems/CRX/utils';
import { useNetworks } from '~/systems/Network';

export function useFundWallet() {
  const { selectedNetwork } = useNetworks();
  const { account } = useAccounts();

  const { faucetUrl, bridgeUrl } = useMemo(() => {
    const network = DEFAULT_NETWORKS.find(
      (n) => n.url === selectedNetwork?.url
    );
    return {
      bridgeUrl: (network?.bridgeUrl || selectedNetwork?.bridgeUrl) ?? null,
      faucetUrl: (network?.faucetUrl || selectedNetwork?.faucetUrl) ?? null,
    };
  }, [selectedNetwork]);

  const open = useCallback(() => {
    let url: URL | null = null;
    if (faucetUrl) {
      if (!account || !account.address) return faucetUrl;
      const address = Address.fromDynamicInput(account.address).toB256();
      url = new URL(faucetUrl);
      url.searchParams.set('address', address);
    } else if (bridgeUrl) {
      url = new URL(bridgeUrl);
    }

    if (!url) return;
    if (IS_CRX) {
      openTab(url.toString());
      return;
    }
    window.open(url, '_blank');
  }, [account, bridgeUrl, faucetUrl]);

  return {
    open,
    faucetUrl,
    bridgeUrl,
    hasFaucet: !!faucetUrl,
    hasBridge: !!bridgeUrl,
    showFund: !!faucetUrl || !!bridgeUrl,
  };
}
