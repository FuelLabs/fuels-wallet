import type { JSONRPCRequest } from 'json-rpc-2.0';

import type { VaultClient } from '../services/VaultClient';

import { Vault } from '~/systems/Vault/services/VaultServer';

export class VaultWebConnector {
  vault: Vault;
  readonly clientVault: VaultClient;

  constructor(clientVault: VaultClient) {
    this.clientVault = clientVault;
    this.vault = new Vault();
    this.clientVault.onRequest = this.onRequest.bind(this);
  }

  async onRequest(request: JSONRPCRequest) {
    const response = await this.vault.server.receive(request);
    if (response) {
      this.clientVault.client.receive(response);
    }
  }
}
