import type {
  EventMessage,
  MessageTypes,
  ResponseMessage,
  RequestMessage,
  UIEventMessage,
} from '@fuels/connectors';
import type {
  ICreateChange,
  IUpdateChange,
  IDeleteChange,
} from 'dexie-observable/api';

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
