import type { JSONRPCRequest, JSONRPCResponse } from 'json-rpc-2.0';

export enum EventType {
  uiEvent = 'uiEvent',
  event = 'event',
  request = 'request',
  response = 'response',
}

export type FuelWeb3Event<T = unknown> = {
  type: EventType.event;
  target: string;
  events: Array<{
    event: string;
    params: Array<T>;
  }>;
};

export type FuelWeb3Response = {
  type: EventType.response;
  target: string;
  response: JSONRPCResponse;
};

export type FuelWeb3Request = {
  type: EventType.request;
  target: string;
  request: JSONRPCRequest;
};

export type FuelWeb3Message =
  | FuelWeb3Response
  | FuelWeb3Request
  | FuelWeb3Event;
