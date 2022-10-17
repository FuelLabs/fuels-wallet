import type { JSONRPCResponse } from 'json-rpc-2.0';

export type FuelEventMessage<T> = {
  target: string;
  event: string;
  data?: T;
};

export type FuelRPCMessage = {
  target: string;
  request: JSONRPCResponse;
};

export type FuelMessage<T = void> = FuelEventMessage<T> | FuelRPCMessage;

export type EventCallback = <T = void>(event: FuelEventMessage<T>) => void;
