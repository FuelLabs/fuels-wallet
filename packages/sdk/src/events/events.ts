import EventEmitter from 'events';

import type { EventConnector, EventsOptions, EventMessage } from './types';

export class Events<T extends EventConnector<T>> extends EventEmitter {
  id: string;
  name: string;
  connector: T;

  constructor(options: EventsOptions<T>) {
    super();
    this.id = options.id;
    this.name = options.name;
    this.connector = options.connector;
    options.connector.setupListener(this.onMessage.bind(this));
  }

  createMessage<DataType = void>(
    event: string,
    data?: DataType
  ): EventMessage<DataType, T> {
    return {
      id: this.id,
      name: this.name,
      event,
      data,
    };
  }

  onMessage<D = void>(eventMessage: EventMessage<D, T>) {
    if (eventMessage.id !== this.id && eventMessage.name === this.name) {
      this.emit(eventMessage.event, eventMessage.data);
    }
  }

  send<DataType = void>(eventName: string, data?: DataType) {
    this.connector.postMessage(this.createMessage<DataType>(eventName, data));
  }
}
