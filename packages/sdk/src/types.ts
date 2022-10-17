import type { JSONRPCResponse } from 'json-rpc-2.0';

export type FuelEventMessage = {
  type: 'event';
  target: string;
  data: Array<{
    event: string;
    params: Array<any>;
  }>;
};

export type FuelRPCMessage = {
  target: string;
  request: JSONRPCResponse;
};

export type FuelMessage = FuelEventMessage | FuelRPCMessage;

export type EventCallback = (event: FuelEventMessage) => void;
