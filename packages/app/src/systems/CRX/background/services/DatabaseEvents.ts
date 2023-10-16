import type {
  Account,
  Connection,
  EventMessage,
  EventMessageEvents,
} from '@fuel-wallet/types';
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';
import { AssetService } from '~/systems/Asset/services';
import { ConnectionService } from '~/systems/DApp/services';

import type { CommunicationProtocol } from './CommunicationProtocol';
import { DatabaseObservable } from './DatabaseObservable';

export class DatabaseEvents {
  readonly databaseObservable: DatabaseObservable<
    ['networks', 'accounts', 'assets', 'connections']
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
        ]),
      );
    });

    this.databaseObservable.on('accounts:update', async (updateEvent) => {
      // Broadcast only if it's the current account
      if (!updateEvent.obj.isCurrent) return;

      const currentAccount = updateEvent.obj as Account;
      const connections = await ConnectionService.getConnections();
      const getOriginsForConnections = (connections: Array<Connection>) =>
        connections.map((c) => c.origin);
      const addressConnectedOrigins = getOriginsForConnections(
        connections.filter((c) => c.accounts.includes(currentAccount.address)),
      );
      const addressNotConnectedOrigins = getOriginsForConnections(
        connections.filter((c) => !addressConnectedOrigins.includes(c.origin)),
      );
      const hasUnconnectedOrigins =
        addressNotConnectedOrigins.length !== addressConnectedOrigins.length;

      // Notify all connections that the current account is connected
      // by sending the current account address
      this.communicationProtocol.broadcast(
        addressConnectedOrigins,
        this.createEvents([
          {
            event: 'currentAccount',
            params: [updateEvent.obj.address],
          },
        ]),
      );
      // Nofity all connections that the current account is not connected
      // by sending a null value
      if (hasUnconnectedOrigins) {
        this.communicationProtocol.broadcast(
          addressNotConnectedOrigins,
          this.createEvents([
            {
              event: 'currentAccount',
              params: [null],
            },
          ]),
        );
      }
    });

    this.databaseObservable.on(
      'assets:update',
      (updateEvent) => updateEvent.obj.isCustom && this.broadcastAssets(),
    );
    this.databaseObservable.on('assets:delete', () => this.broadcastAssets());
    this.databaseObservable.on('assets:create', () => this.broadcastAssets());

    this.databaseObservable.on('connections:delete', async (updateEvent) => {
      const deletedConnection = updateEvent.oldObj as Connection;

      this.communicationProtocol.broadcast(
        deletedConnection.origin,
        this.createEvents([
          {
            event: 'connection',
            params: [false],
          },
        ]),
      );
    });
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
      ]),
    );
  }
}
