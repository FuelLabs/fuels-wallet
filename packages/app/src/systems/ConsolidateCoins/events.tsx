import type { Store } from '~/store';
import { Services } from '~/store';

export function consolidateCoinsEvents(store: Store) {
  return {
    consolidateCoins() {
      store.send(Services.consolidateCoins, { type: 'CONSOLIDATE_COINS' });
    },
  };
}
