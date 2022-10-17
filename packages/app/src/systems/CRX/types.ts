export enum Methods {
  getTabId = 'getTabId',
  isReady = 'isReady',
}

export enum EventTypes {
  request = 'request',
  response = 'response',
  event = 'event',
  popup = 'popup',
  removeConnection = 'removeConnection',
}

export type CommunicationEvent<T = any> = {
  readonly message: T;
  readonly id: string;
  readonly sender: chrome.runtime.Port['sender'];
};

export type CommunicationMessage<T = any> = {
  readonly type: EventTypes;
  readonly target: string;
  readonly data: T;
};

export type CommunicationPostMessage<T = any> = {
  readonly id: string;
  readonly type: EventTypes;
  readonly target: string;
  readonly data: T;
};
