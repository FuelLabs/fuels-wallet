import type { Store } from '../Store';
import { Services } from '../Store';

import type { OverlayData } from './machines/overlayMachine';

export function overlayEvents(store: Store) {
  return {
    openOverlay(input: OverlayData) {
      store.send(Services.overlay, { type: 'OPEN', input });
    },
    closeOverlay() {
      store.send(Services.overlay, { type: 'CLOSE' });
    },
    openAccountList() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: {
          modal: 'accounts.list',
        },
      });
    },
    openAccountEdit(address: string) {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'accounts.edit', params: address },
      });
    },
    openAccountImport() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'accounts.import' },
      });
    },
    openAccountExport(address: string) {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'accounts.export', params: address },
      });
    },
    openAccountsLogout() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'accounts.logout' },
      });
    },
    openNetworksList() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'networks.list' },
      });
    },
    openNetworksAdd() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'networks.add' },
      });
    },
    openNetworkUpdate(params: { id: string }) {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'networks.update', params },
      });
    },
    openTransactionApprove() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: { modal: 'transactions.approve' },
      });
    },
    openViewSeedPhrase() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: {
          modal: 'settings.viewSeedPhrase',
        },
      });
    },
    openResetDialog() {
      store.send(Services.overlay, {
        type: 'OPEN',
        input: {
          modal: 'reset',
        },
      });
    },
  };
}
