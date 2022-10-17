import type { JSONRPCRequest, JSONRPCResponse } from 'json-rpc-2.0';

export enum EventTypes {
  uiEvent = 'uiEvent',
  event = 'event',
  request = 'request',
  response = 'response',
  removeConnection = 'removeConnection',
}

export type UIEventMessage = {
  readonly target: string;
  readonly type: EventTypes.uiEvent;
  readonly id: string;
  readonly ready: boolean;
  readonly sender?: chrome.runtime.Port['sender'];
};

export type RequestMessage = {
  readonly target: string;
  readonly type: EventTypes.request;
  readonly id: string;
  readonly request: JSONRPCRequest;
  readonly sender?: chrome.runtime.Port['sender'];
};

export type ResponseMessage = {
  readonly target: string;
  readonly type: EventTypes.response;
  readonly id: string;
  readonly response: JSONRPCResponse;
  readonly sender?: chrome.runtime.Port['sender'];
};

export type CommunicationEventNew<T> = T extends EventTypes.request
  ? RequestMessage
  : T extends EventTypes.response
  ? ResponseMessage
  : T extends EventTypes.uiEvent
  ? UIEventMessage
  : T extends EventTypes.removeConnection
  ? string
  : unknown;

export type CommunicationPostMessageNew =
  | UIEventMessage
  | RequestMessage
  | ResponseMessage;

export type CommunicationEvent<T = any> = {
  readonly message: T;
  readonly id: string;
  readonly sender: chrome.runtime.Port['sender'];
};

export type CommunicationMessage<
  T = Array<{ event: string; params: Array<any> }>
> = {
  readonly type: EventTypes;
  readonly target: string;
  readonly events: T;
};

export type CommunicationPostMessage<T = any> = {
  readonly id: string;
  readonly type: EventTypes;
  readonly target: string;
  readonly data: T;
};
