import type { JSONRPCRequest } from 'json-rpc-2.0';
import { IS_DEVELOPMENT, IS_TEST } from '~/config';
import { VaultServer } from '~/systems/Vault/services/VaultServer';

import { mockUnlock } from '../__mocks__/mockUnlock';
import type { VaultClient } from '../services/VaultClient';

export class VaultWebConnector {
  vault: VaultServer;
  readonly clientVault: VaultClient;

  constructor(clientVault: VaultClient) {
    this.clientVault = clientVault;
    this.vault = new VaultServer();
    this.clientVault.onRequest = this.onRequest.bind(this);

    // Mock unlock in development to save password
    // on session Storage
    if (IS_DEVELOPMENT || IS_TEST) {
      mockUnlock(this);
    }
  }

  async onRequest(request: JSONRPCRequest) {
    const response = await this.vault.server.receive(request);
    if (response) {
      this.clientVault.client.receive(response);
    }
  }
}
