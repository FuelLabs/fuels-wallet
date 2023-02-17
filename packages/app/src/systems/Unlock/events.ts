import type { Store } from '~/store';
import { Services } from '~/store';

export function unlockEvents(store: Store) {
  return {
    lock() {
      store.send(Services.unlock, { type: 'LOCK_WALLET' });
    },
    unlock(input: { password: string }) {
      store.send(Services.unlock, {
        type: 'UNLOCK_WALLET',
        input,
      });
    },
  };
}
