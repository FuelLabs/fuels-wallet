import type {
  ICreateChange,
  IUpdateChange,
  IDeleteChange,
} from 'dexie-observable/api';
import type { JSONRPCRequest, JSONRPCResponse } from 'json-rpc-2.0';

import type { Asset } from './asset';
import type { Network } from './network';

export const FuelWalletEvents = {
  accounts: 'accounts',
  currentAccount: 'currentAccount',
  connection: 'connection',
  network: 'network',
  assets: 'assets',
  connectors: 'connectors',
  currentConnector: 'currentConnector',
  load: 'load',
} as const;

export type FuelEvents =
  | {
      type: typeof FuelWalletEvents.accounts;
      data: Array<string>;
    }
  | {
      type: typeof FuelWalletEvents.currentAccount;
      data: string | null;
    }
  | {
      type: typeof FuelWalletEvents.connection;
      data: boolean;
    }
  | {
      type: typeof FuelWalletEvents.network;
      data: Network;
    }
  | {
      type: typeof FuelWalletEvents.assets;
      data: Array<Asset>;
    }
  | {
      type: typeof FuelWalletEvents.connectors;
      data: Array<FuelWalletConnector>;
    }
  | {
      type: typeof FuelWalletEvents.currentConnector;
      data: FuelWalletConnector;
    }
  | {
      type: typeof FuelWalletEvents.load;
      data: boolean;
    };

export type FuelEventArg<T extends FuelEvents['type']> = Extract<
  FuelEvents,
  { type: T }
>['data'];

export enum MessageTypes {
  ping = 'ping',
  uiEvent = 'uiEvent',
  event = 'event',
  request = 'request',
  response = 'response',
  removeConnection = 'removeConnection',
}

export type BaseEvent<T> = {
  readonly target: string;
  readonly connectorName?: string;
  readonly id?: string;
  readonly sender?: chrome.runtime.Port['sender'];
} & T;

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

export type EventMessageEvents = Array<{
  event: string;
  params: Array<unknown>;
}>;

export type EventMessage<T = EventMessageEvents> = BaseEvent<{
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

export type FuelProviderConfig = {
  id?: string;
  url: string;
};

export type FuelWalletConnector = {
  name: string;
  imageUrl?: string;
};
