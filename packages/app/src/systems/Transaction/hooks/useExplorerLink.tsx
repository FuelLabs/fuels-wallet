import { buildBlockExplorerUrl } from 'fuels';
import { useCallback } from 'react';
import { IS_CRX, EXPLORER_URL, VITE_FUEL_PROVIDER_URL } from '~/config';
import { openTab } from '~/systems/CRX/utils';
import { urlJoin } from '~/systems/Core';

export function useExplorerLink(providerUrl: string, id?: string) {
  let href = buildBlockExplorerUrl({
    txId: id,
    providerUrl,
  });

  // Use the new explorer only if the provider is the default one
  if (providerUrl === VITE_FUEL_PROVIDER_URL) {
    href = urlJoin(EXPLORER_URL, `/tx/${id}`);
  }

  const openExplorer = useCallback(() => {
    if (IS_CRX) {
      openTab(href);
    } else {
      window.location.href = href;
    }
  }, [providerUrl, id]);

  return {
    href,
    openExplorer,
  };
}
