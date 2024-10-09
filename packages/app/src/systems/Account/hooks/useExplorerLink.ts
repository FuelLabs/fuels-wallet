import type { B256Address } from 'fuels';
import { useCallback, useMemo } from 'react';
import { IS_CRX } from '~/config';
import { openTab } from '~/systems/CRX/utils';
import { urlJoin } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';

export function useExplorerLink(address: B256Address | undefined) {
  const { selectedNetwork } = useNetworks();
  const href = useMemo<string | null>(() => {
    if (!selectedNetwork?.explorerUrl) return null;
    return urlJoin(selectedNetwork.explorerUrl, `/account/${address}`);
  }, [address, selectedNetwork]);

  const openExplorer = useCallback(() => {
    if (!href) return;
    if (IS_CRX) {
      openTab(href);
    } else {
      window.open(href, '_blank');
    }
  }, [href]);

  return {
    href,
    openExplorer,
    enabled: !!href,
  };
}
