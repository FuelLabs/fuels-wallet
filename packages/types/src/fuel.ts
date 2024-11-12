import type {
  EventMessage,
  MessageTypes,
  RequestMessage,
  ResponseMessage,
  UIEventMessage,
} from './connector';

export enum DatabaseChangeType {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

// Define the change event interfaces since Dexie doesn't export them
export interface ICreateChange<T = unknown, Y = unknown> {
  type: DatabaseChangeType.Create;
  table: string;
  key: T;
  obj: Y;
  source?: string;
}

export interface IUpdateChange<T = unknown, Y = unknown> {
  type: DatabaseChangeType.Update;
  table: string;
  key: T;
  mods: Y; //{ [keyPath: string]: unknown | undefined };
  obj: Y;
  source?: string;
}

export interface IDeleteChange<T = unknown, Y = unknown> {
  type: DatabaseChangeType.Delete;
  table: string;
  key: T;
  oldObj: Y;
  source?: string;
}

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

export type FuelProviderConfig = {
  id?: string;
  url: string;
};
