import type {
  Account,
  Connection,
  EventMessage,
  EventMessageEvents,
  NetworkData,
} from '@fuel-wallet/types';
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';
import { ConnectionService } from '~/systems/DApp/services';

import { FuelConnectorEventTypes } from 'fuels';
import type { CommunicationProtocol } from './CommunicationProtocol';
import { DatabaseObservable } from './DatabaseObservable';

export class DatabaseEvents {
  readonly databaseObservable: DatabaseObservable<
    ['networks', 'accounts', 'connections']
  >;

  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    this.communicationProtocol = communicationProtocol;
    this.databaseObservable = new DatabaseObservable([
      'networks',
      'accounts',
      'connections',
    ]);
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
    this.databaseObservable.on<'networks:update', NetworkData>(
      'networks:update',
      async (updateEvent) => {
        // Broadcast only if the network is selected
        if (!updateEvent.obj.isSelected) return;

        const connections = await ConnectionService.getConnections();
        const origins = connections.map((connection) => connection.origin);

        this.communicationProtocol.broadcast(
          origins,
          this.createEvents([
            {
              event: FuelConnectorEventTypes.currentNetwork,
              params: [
                {
                  url: updateEvent.obj.url,
                },
              ],
            },
          ])
        );
      }
    );

    this.databaseObservable.on<'accounts:update', Account>(
      'accounts:update',
      async (updateEvent) => {
        // Broadcast only if it's the current account
        if (!updateEvent.obj.isCurrent) return;

        const currentAccount = updateEvent.obj;
        const connections = await ConnectionService.getConnections();
        const getOriginsForConnections = (connections: Array<Connection>) =>
          connections.map((c) => c.origin);
        const addressConnectedOrigins = getOriginsForConnections(
          connections.filter((c) => c.accounts.includes(currentAccount.address))
        );
        const addressNotConnectedOrigins = getOriginsForConnections(
          connections.filter((c) => !addressConnectedOrigins.includes(c.origin))
        );
        const hasUnconnectedOrigins =
          addressNotConnectedOrigins.length !== addressConnectedOrigins.length;

        // Notify all connections that the current account is connected
        // by sending the current account address
        this.communicationProtocol.broadcast(
          addressConnectedOrigins,
          this.createEvents([
            {
              event: FuelConnectorEventTypes.currentAccount,
              params: [updateEvent.obj.address],
            },
          ])
        );
        // Nofity all connections that the current account is not connected
        // by sending a null value
        if (hasUnconnectedOrigins) {
          this.communicationProtocol.broadcast(
            addressNotConnectedOrigins,
            this.createEvents([
              {
                event: FuelConnectorEventTypes.currentAccount,
                params: [null],
              },
            ])
          );
        }
      }
    );

    this.databaseObservable.on<'connections:update', Connection>(
      'connections:update',
      async (updateEvent) => {
        const updatedConnection = updateEvent.obj;

        this.communicationProtocol.broadcast(
          updatedConnection.origin,
          this.createEvents([
            {
              event: FuelConnectorEventTypes.accounts,
              params: [updatedConnection.accounts],
            },
          ])
        );
      }
    );

    this.databaseObservable.on('connections:delete', async (deleteEvent) => {
      const deletedConnection = deleteEvent.oldObj as Connection;

      this.communicationProtocol.broadcast(
        deletedConnection.origin,
        this.createEvents([
          {
            event: FuelConnectorEventTypes.connection,
            params: [false],
          },
        ])
      );
    });
  }

  stop() {
    this.databaseObservable.destroy();
  }
}
