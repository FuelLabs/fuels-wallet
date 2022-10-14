/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'events';

import type {
  EventConnector,
  EventsOptions,
  EventMessage,
  MessagePost,
} from './types';

export class Events<T = void> extends EventEmitter {
  id: string;
  name: string;
  connector: EventConnector<T>;
  interceptor: EventsOptions<T>['interceptor'] = async () => true;

  constructor(options: EventsOptions<T>) {
    super();
    this.id = options.id;
    this.name = options.name;
    this.connector = options.connector;
    this.interceptor = options.interceptor || this.interceptor;
    options.connector.setupListener(this.onMessage.bind(this));
  }

  createMessage(event: string, data?: any): MessagePost<T> {
    return {
      id: this.id,
      name: this.name,
      event,
      data,
    };
  }

  emit(eventName: string, data: any, eventMessage: EventMessage<T>): boolean {
    return super.emit(eventName, data, eventMessage);
  }

  async onMessage(eventMessage: EventMessage<T>) {
    if (eventMessage.id !== this.id && eventMessage.name === this.name) {
      const shouldContinue = await this.interceptor!(eventMessage, this.send);
      if (shouldContinue) {
        this.emit(
          eventMessage.event,
          Object.freeze(eventMessage.data),
          Object.freeze(eventMessage)
        );
      }
    }
  }

  send(eventName: string, data?: any) {
    this.connector.postMessage(this.createMessage(eventName, data));
  }
}
