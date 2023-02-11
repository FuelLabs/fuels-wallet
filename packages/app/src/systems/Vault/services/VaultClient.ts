import type { JSONRPCParams, JSONRPCRequest } from 'json-rpc-2.0';
import { JSONRPCClient } from 'json-rpc-2.0';

import { VaultCRXConnector, VaultWebConnector } from '../connectors';

import { Vault } from './VaultServer';

import { IS_CRX } from '~/config';

export class VaultClient {
  readonly client: JSONRPCClient;

  constructor() {
    // Setup client JSONRPC
    this.client = new JSONRPCClient(async (request) => {
      this.onRequest(request);
    });
    // Setup methods
    this.setupMethods();
    // Connect to a connector
    this.connect();
  }

  setupMethods = () => {
    Vault.methods.forEach((methodName) => {
      this[methodName] = this.createRequest(methodName);
    });
  };

  connect = () => {
    if (IS_CRX) return new VaultCRXConnector(this);
    return new VaultWebConnector(this);
  };

  onRequest = async (_request: JSONRPCRequest): Promise<void> => {
    throw new Error('No connector provided');
  };

  createRequest = (method: string) => {
    return (params: JSONRPCParams) => {
      return this.client.request(method, params);
    };
  };
}
