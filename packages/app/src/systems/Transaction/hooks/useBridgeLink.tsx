import { useCallback, useMemo } from 'react';
import { IS_CRX } from '~/config';
import { openTab } from '~/systems/CRX/utils';
import { urlJoin } from '~/systems/Core';
import { useNetworks } from '~/systems/Network';

export function useBridgeLink() {
  const { selectedNetwork } = useNetworks();
  const href = useMemo<string | null>(() => {
    if (!selectedNetwork?.bridgeUrl) return null;
    return urlJoin(selectedNetwork.bridgeUrl, '/history');
  }, [selectedNetwork]);

  const openBridge = useCallback(() => {
    if (!href) return;
    if (IS_CRX) {
      openTab(href);
    } else {
      window.location.href = href;
    }
  }, [href]);

  return {
    href,
    openBridge,
    enabled: !!href,
  };
}
