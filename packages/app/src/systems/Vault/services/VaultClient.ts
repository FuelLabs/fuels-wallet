// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import EventEmitter from 'events';
import type { JSONRPCParams, JSONRPCRequest } from 'json-rpc-2.0';
import { JSONRPCClient } from 'json-rpc-2.0';
import { IS_CRX } from '~/config';

import { VaultCRXConnector, VaultWebConnector } from '../connectors';

import { VaultServer } from './VaultServer';

export class VaultClient extends EventEmitter {
  readonly client: JSONRPCClient;
  connection: chrome.runtime.Port | undefined;
  constructor() {
    super();
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
    // biome-ignore lint/complexity/noForEach: <explanation>
    VaultServer.methods.forEach((methodName) => {
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
