import type {
  ICreateChange,
  IUpdateChange,
  IDeleteChange,
} from 'dexie-observable/api';
import type { JSONRPCRequest, JSONRPCResponse } from 'json-rpc-2.0';

export type FuelWeb3Events =
  | {
      type: 'accounts';
      data: Array<string>;
    }
  | {
      type: 'connection';
      data: boolean;
    };

export type FuelWeb3EventArg<T extends FuelWeb3Events['type']> = Extract<
  FuelWeb3Events,
  { type: T }
>['data'];

export enum MessageTypes {
  uiEvent = 'uiEvent',
  event = 'event',
  request = 'request',
  response = 'response',
  removeConnection = 'removeConnection',
}

export type BaseEvent<T> = {
  readonly target: string;
  readonly id?: string;
  readonly sender?: chrome.runtime.Port['sender'];
} & T;

export type UIEventMessage = BaseEvent<{
  readonly type: MessageTypes.uiEvent;
  readonly ready: boolean;
}>;

export type RequestMessage = BaseEvent<{
  readonly type: MessageTypes.request;
  readonly request: JSONRPCRequest;
}>;

export type ResponseMessage = BaseEvent<{
  readonly type: MessageTypes.response;
  readonly response: JSONRPCResponse;
}>;

export type EventMessage<T = Array<{ event: string; params: Array<unknown> }>> =
  BaseEvent<{
    readonly type: MessageTypes.event;
    readonly events: T;
  }>;

export type CommunicationEventArg<T> = T extends MessageTypes.request
  ? RequestMessage
  : T extends MessageTypes.response
  ? ResponseMessage
  : T extends MessageTypes.uiEvent
  ? UIEventMessage
  : T extends MessageTypes.event
  ? EventMessage
  : T extends MessageTypes.removeConnection
  ? string
  : unknown;

export type CommunicationMessage =
  | UIEventMessage
  | RequestMessage
  | ResponseMessage
  | EventMessage;

export type DatabaseEvents = ['delete', 'create', 'update'];
export type DatabaseObservableEvent<T extends Array<string>> =
  `${T[number]}:${DatabaseEvents[number]}`;

export type DatabaseEventArg<T extends string> = T extends `${string}:create`
  ? ICreateChange
  : T extends `${string}:update`
  ? IUpdateChange
  : T extends `${string}:delete`
  ? IDeleteChange
  : unknown;
