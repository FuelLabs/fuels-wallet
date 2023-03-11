import type { Store } from '../Store';
import { Services } from '../Store';

import type { OverlayKeys } from './machines/overlayMachine';

export function overlayEvents(store: Store) {
  return {
    openOverlay(input: OverlayKeys) {
      store.send(Services.overlay, { type: 'OPEN', input });
    },
    closeOverlay() {
      store.send(Services.overlay, { type: 'CLOSE' });
    },
    openAccountList() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.list',
      });
    },
    openAccountsAdd() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.add',
      });
    },
    openAccountImport() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.import',
      });
    },
    openAccountExport() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.export',
      });
    },
    openAccountsLogout() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'accounts.logout',
      });
    },
    openNetworksList() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'networks.list',
      });
    },
    openNetworksAdd() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'networks.add',
      });
    },
    openTransactionApprove() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: 'transactions.approve',
      });
    },
  };
}
