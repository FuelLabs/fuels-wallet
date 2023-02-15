import type {
  Account,
  EventMessage,
  EventMessageEvents,
} from '@fuel-wallet/types';
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { DatabaseObservable } from './DatabaseObservable';

import { AssetService } from '~/systems/Asset/services';
import { ConnectionService } from '~/systems/DApp/services';

export class DatabaseEvents {
  readonly databaseObservable: DatabaseObservable<
    ['networks', 'accounts', 'assets']
  >;

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
      // Broadcast only if the network is selected
      if (!updateEvent.obj.isSelected) return;

      const connections = await ConnectionService.getConnections();
      const origins = connections.map((connection) => connection.origin);

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

    this.databaseObservable.on('accounts:update', async (updateEvent) => {
      // Broadcast only if it's the current account
      if (!updateEvent.obj.isCurrent) return;

      const currentAccount = updateEvent.obj as Account;
      const connections = await ConnectionService.getConnections();
      const origins = connections
        .filter((connection) =>
          connection.accounts.includes(currentAccount?.address || '')
        )
        .map((connection) => connection.origin);

      this.communicationProtocol.broadcast(
        origins,
        this.createEvents([
          {
            event: 'currentAccount',
            params: [updateEvent.obj.address],
          },
        ])
      );
    });

    this.databaseObservable.on(
      'assets:update',
      (updateEvent) => updateEvent.obj.isCustom && this.broadcastAssets()
    );
    this.databaseObservable.on('assets:delete', () => this.broadcastAssets());
    this.databaseObservable.on('assets:create', () => this.broadcastAssets());
  }

  async broadcastAssets() {
    const connections = await ConnectionService.getConnections();
    const origins = connections.map((connection) => connection.origin);
    const assets = await AssetService.getAssets();

    this.communicationProtocol.broadcast(
      origins,
      this.createEvents([
        {
          event: 'assets',
          params: [assets],
        },
      ])
    );
  }
}
