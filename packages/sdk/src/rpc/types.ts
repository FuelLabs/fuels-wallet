/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RPC } from './rpc';

export type RPCConnector<T = any> = {
  postMessage: (request: RPCMessage, params?: T) => void;
  setupListener: (
    receive: (request: RPCMessage, params?: T) => void,
    rpc: RPC
  ) => void;
};

export type RPCOptions = {
  id: string;
  name: string;
  connector: RPCConnector;
};

export type RPCMessage = Partial<{
  id: string;
  name: string;
  request: unknown;
  metadata: unknown;
}>;
