import { getBlockExplorerLink } from '@fuel-wallet/sdk';
import { useCallback } from 'react';
import { IS_CRX } from '~/config';
import { openTab } from '~/systems/CRX/utils';

export function useExplorerLink(providerUrl: string, id?: string) {
  const href = getBlockExplorerLink({
    path: `transaction/${id || ''}`,
    providerUrl,
  });

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
