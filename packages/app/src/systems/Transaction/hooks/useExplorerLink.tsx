import { buildBlockExplorerUrl } from 'fuels';
import { useCallback, useMemo } from 'react';
import { EXPLORER_URL, IS_CRX, VITE_FUEL_PROVIDER_URL } from '~/config';
import { openTab } from '~/systems/CRX/utils';
import { urlJoin } from '~/systems/Core';

export function useExplorerLink(providerUrl: string, id?: string) {
  const href = useMemo<string>(() => {
    // Use the new explorer only if the provider is the default one
    if (providerUrl === VITE_FUEL_PROVIDER_URL) {
      return urlJoin(EXPLORER_URL, `/tx/${id}`);
    }

    return buildBlockExplorerUrl({
      txId: id,
      providerUrl,
    });
  }, [id, providerUrl]);

  const openExplorer = useCallback(() => {
    if (IS_CRX) {
      openTab(href);
    } else {
      window.location.href = href;
    }
  }, [href]);

  return {
    href,
    openExplorer,
  };
}
