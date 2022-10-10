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
  ): Omit<EventMessage<DataType, T>, 'origin'> {
    return {
      id: this.id,
      name: this.name,
      event,
      data,
    };
  }

  emit<D = void>(
    eventName: string,
    data: D,
    eventMessage: EventMessage<typeof data, T>
  ): boolean {
    return super.emit(eventName, data, eventMessage);
  }

  onMessage<D = void>(eventMessage: EventMessage<D, T>) {
    if (eventMessage.id !== this.id && eventMessage.name === this.name) {
      this.emit(
        eventMessage.event,
        Object.freeze(eventMessage.data),
        Object.freeze(eventMessage)
      );
    }
  }

  send<DataType = void>(eventName: string, data?: DataType) {
    this.connector.postMessage(this.createMessage<DataType>(eventName, data));
  }
}
