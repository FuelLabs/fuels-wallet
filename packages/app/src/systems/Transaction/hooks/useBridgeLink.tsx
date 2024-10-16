import { type MouseEvent, useCallback, useMemo } from 'react';
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

  const openBridge = useCallback(
    (e?: MouseEvent<HTMLAnchorElement>) => {
      if (!href || IS_CRX) return;
      e?.preventDefault();
      window.location.href = href;
    },
    [href]
  );

  return {
    href,
    openBridge,
    enabled: !!href,
  };
}
