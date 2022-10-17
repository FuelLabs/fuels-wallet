/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';

import type { RPCMessage, RPCOptions } from './types';

export class RPC {
  id: string;
  name: string;
  server: JSONRPCServerAndClient;

  constructor(options: RPCOptions) {
    this.id = options.id;
    this.name = options.name;
    this.server = new JSONRPCServerAndClient<void, any>(
      new JSONRPCServer(),
      new JSONRPCClient(async (rpcRequest, clientParams) => {
        const request = this.createMessage(rpcRequest);
        options.connector.postMessage(request, clientParams);
      })
    );
    options.connector.setupListener(this.onMessage.bind(this), this);
  }

  createMessage(jsonRPCRequest: unknown) {
    return {
      serviceId: this.id,
      serverId: this.name,
      request: jsonRPCRequest,
    };
  }

  onMessage(data: RPCMessage) {
    if (data.id === this.id) {
      if (data.name !== this.name) {
        this.server.receiveAndSend(data.request);
      }
    }
  }
}
