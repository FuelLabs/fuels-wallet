import type { JSONRPCRequest, JSONRPCResponse } from 'json-rpc-2.0';

export const CONNECTOR_SCRIPT = 'FuelConnectorScript';
export const CONTENT_SCRIPT_NAME = 'FuelContentScript';
export const EVENT_MESSAGE = 'message';

export enum MessageTypes {
  ping = 'ping',
  uiEvent = 'uiEvent',
  event = 'event',
  request = 'request',
  response = 'response',
  removeConnection = 'removeConnection',
}

export interface MessageSender {
  id?: string | undefined;
  origin?: string | undefined;
  tab?: {
    id?: number | undefined;
    index?: number | undefined;
    windowId?: number | undefined;
    url?: string | undefined;
    title?: string | undefined;
    favIconUrl?: string | undefined;
  };
}

type BaseEvent<T> = {
  readonly target: string;
  readonly connectorName?: string;
  readonly id?: string;
  readonly sender?: MessageSender;
} & T;

export type EventMessageEvents = Array<{
  event: string;
  params: Array<unknown>;
}>;

export type UIEventMessage = BaseEvent<{
  readonly type: MessageTypes.uiEvent;
  readonly ready: boolean;
  readonly session: string;
}>;

export type RequestMessage = BaseEvent<{
  readonly type: MessageTypes.request;
  readonly request: JSONRPCRequest;
}>;

export type ResponseMessage = BaseEvent<{
  readonly type: MessageTypes.response;
  readonly response: JSONRPCResponse;
}>;

export type EventMessage<T = EventMessageEvents> = BaseEvent<{
  readonly type: MessageTypes.event;
  readonly events: T;
}>;

export type CommunicationMessage =
  | UIEventMessage
  | RequestMessage
  | ResponseMessage
  | EventMessage;
