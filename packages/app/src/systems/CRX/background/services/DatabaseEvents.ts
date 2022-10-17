import { CONTENT_SCRIPT_NAME } from '@fuels-wallet/sdk';
import type { ICreateChange, IDeleteChange } from 'dexie-observable/api';

import { EventTypes } from '../../types';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { DatabaseObservable } from './DatabaseObservable';

export class DatabaseEvents {
  readonly communicationProtocol: CommunicationProtocol;
  readonly databaseObservable: DatabaseObservable;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.databaseObservable = new DatabaseObservable();
    this.setupApplicationWatcher();
  }

  setupApplicationWatcher() {
    this.databaseObservable.on<ICreateChange>(
      'applications:create',
      (createEvent) => {
        this.communicationProtocol.broadcast(createEvent.key, {
          target: CONTENT_SCRIPT_NAME,
          type: EventTypes.event,
          events: [
            {
              event: 'accounts',
              params: [createEvent.obj.accounts],
            },
            {
              event: 'connection',
              params: [true],
            },
          ],
        });
      }
    );
    this.databaseObservable.on<IDeleteChange>(
      'applications:delete',
      (deleteEvent) => {
        this.communicationProtocol.broadcast(deleteEvent.key, {
          target: CONTENT_SCRIPT_NAME,
          type: EventTypes.event,
          events: [
            {
              event: 'connection',
              params: [false],
            },
          ],
        });
      }
    );
  }
}
