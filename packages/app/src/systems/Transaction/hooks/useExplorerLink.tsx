import { useCallback, useMemo } from 'react';
import { IS_CRX } from '~/config';
import { openTab } from '~/systems/CRX/utils';
import { urlJoin } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';

export function useExplorerLink(id?: string) {
  const { selectedNetwork } = useNetworks();
  const href = useMemo<string | null>(() => {
    if (!selectedNetwork?.explorerUrl) return null;
    return urlJoin(selectedNetwork.explorerUrl, `/tx/${id}`);
  }, [id, selectedNetwork]);

  const openExplorer = useCallback(() => {
    if (!href) return;
    if (IS_CRX) {
      openTab(href);
    } else {
      window.location.href = href;
    }
  }, [href]);

  return {
    href,
    openExplorer,
    enabled: !!href,
  };
}
