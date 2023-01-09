import type { EventMessage, EventMessageEvents } from '@fuel-wallet/types';
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { DatabaseObservable } from './DatabaseObservable';

import { ConnectionService } from '~/systems/DApp/services';

export class DatabaseEvents {
  readonly databaseObservable: DatabaseObservable<['networks']>;
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.databaseObservable = new DatabaseObservable();
    this.setupApplicationWatcher();
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new DatabaseEvents(communicationProtocol);
  }

  createEvents(events: EventMessageEvents): EventMessage {
    return {
      target: CONTENT_SCRIPT_NAME,
      type: MessageTypes.event,
      events,
    };
  }

  setupApplicationWatcher() {
    this.databaseObservable.on('networks:update', async (updateEvent) => {
      const connections = await ConnectionService.getConnections();
      const origins = connections.map((connection) => connection.origin);

      // Broadcast only if the network is selected
      if (!updateEvent.obj.isSelected) return;

      this.communicationProtocol.broadcast(
        origins,
        this.createEvents([
          {
            event: 'network',
            params: [
              {
                id: updateEvent.obj.id,
                url: updateEvent.obj.url,
              },
            ],
          },
        ])
      );
    });
  }
}
