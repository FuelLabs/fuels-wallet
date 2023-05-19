import type { Store } from '~/store';
import { Services } from '~/store';

export function reportErrorEvents(store: Store) {
  return {
    hasErrorToReport() {
      store.send(Services.unlock, { type: 'CHECK_LOCK' });
    },
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
