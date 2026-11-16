import type { CoinAsset } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { useEffect, useState } from 'react';
import { SEEN_ASSETS_KEY } from '~/config';
import { Storage } from '~/systems/Core';

type SeenAssets = Record<string, string[]>;

/**
 * Assets that showed up since this account last looked at Home on this
 * network. The first look records everything as seen, so nothing is "new"
 * just because the feature shipped or a network was switched to.
 */
export function useNewAssets(key: string, balances?: CoinAsset[]) {
  const [fresh, setFresh] = useState<string[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset per account and network
  useEffect(() => setFresh([]), [key]);

  useEffect(() => {
    if (!key || !balances) return;
    const held = balances
      .filter((balance) => bn(balance.amount).gt(0))
      .map((balance) => balance.assetId);
    const all = Storage.getItem<SeenAssets>(SEEN_ASSETS_KEY) ?? {};
    const seen = all[key];
    const arrived = seen ? held.filter((id) => !seen.includes(id)) : [];
    if (!seen || arrived.length) {
      Storage.setItem(SEEN_ASSETS_KEY, {
        ...all,
        [key]: [...(seen ?? []), ...(seen ? arrived : held)],
      });
    }
    if (arrived.length) setFresh((ids) => [...ids, ...arrived]);
  }, [key, balances]);

  return fresh;
}
