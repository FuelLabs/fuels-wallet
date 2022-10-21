import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuels-wallet/sdk';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { DatabaseObservable } from './DatabaseObservable';

export class DatabaseEvents {
  readonly databaseObservable: DatabaseObservable<['applications']>;

  constructor(readonly communicationProtocol: CommunicationProtocol) {
    this.databaseObservable = new DatabaseObservable();
    this.setupApplicationWatcher();
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new DatabaseEvents(communicationProtocol);
  }

  setupApplicationWatcher() {
    this.databaseObservable.on('applications:create', (createEvent) => {
      this.communicationProtocol.broadcast(createEvent.key, {
        target: CONTENT_SCRIPT_NAME,
        type: MessageTypes.event,
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
    });
    this.databaseObservable.on('applications:delete', (deleteEvent) => {
      this.communicationProtocol.broadcast(deleteEvent.key, {
        target: CONTENT_SCRIPT_NAME,
        type: MessageTypes.event,
        events: [
          {
            event: 'connection',
            params: [false],
          },
        ],
      });
    });
  }
}
