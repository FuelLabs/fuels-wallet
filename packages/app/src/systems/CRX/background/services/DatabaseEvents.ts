import type {
  Account,
  Connection,
  EventMessage,
  EventMessageEvents,
  NetworkData,
} from '@fuel-wallet/types';
import { CONTENT_SCRIPT_NAME, MessageTypes } from '@fuel-wallet/types';
import { ConnectionService } from '~/systems/DApp/services';

import {
  type AccountEvent,
  type AccountsEvent,
  type ConnectionEvent,
  FuelConnectorEventTypes,
  type NetworkEvent,
} from 'fuels';
import type { CommunicationProtocol } from './CommunicationProtocol';
import { DatabaseObservable } from './DatabaseObservable';
import { chromeStorage } from '~/systems/Core/services/chromeStorage';

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

        const result: NetworkEvent['data'] = {
          chainId: updateEvent.obj.chainId,
          url: updateEvent.obj.url,
        };

        this.communicationProtocol.broadcast(
          origins,
          this.createEvents([
            {
              event: FuelConnectorEventTypes.currentNetwork,
              params: [result],
            },
          ])
        );
      }
    );

    // -- START Events for sync db with chrome storage 
    this.databaseObservable.on<'accounts:create', Account>(
      'accounts:create',
      async (event) => {
        const currentAccount = event.obj;
        if (currentAccount) {
          await chromeStorage.accounts.set({
            key: currentAccount.address,
            data: currentAccount,
          });
        }
      }
    );
    this.databaseObservable.on<'accounts:update', Account>(
      'accounts:update',
      async (event) => {
        const currentAccount = event.obj;

        if (currentAccount) {
          await chromeStorage.accounts.set({
            key: currentAccount.address,
            data: currentAccount,
          });
        }
      }
    );
    // -- END Events for sync db with chrome storage 

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
        const result: AccountEvent['data'] = updateEvent.obj.address;
        this.communicationProtocol.broadcast(
          addressConnectedOrigins,
          this.createEvents([
            {
              event: FuelConnectorEventTypes.currentAccount,
              params: [result],
            },
          ])
        );
        // Nofity all connections that the current account is not connected
        // by sending a null value
        if (hasUnconnectedOrigins) {
          const result: AccountEvent['data'] = null;
          this.communicationProtocol.broadcast(
            addressNotConnectedOrigins,
            this.createEvents([
              {
                event: FuelConnectorEventTypes.currentAccount,
                params: [result],
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
        const result: AccountsEvent['data'] = updatedConnection.accounts;

        this.communicationProtocol.broadcast(
          updatedConnection.origin,
          this.createEvents([
            {
              event: FuelConnectorEventTypes.accounts,
              params: [result],
            },
          ])
        );
      }
    );

    this.databaseObservable.on<'connections:delete', Connection>(
      'connections:delete',
      async (deleteEvent) => {
        const deletedConnection = deleteEvent.oldObj;
        const result: ConnectionEvent['data'] = false;

        this.communicationProtocol.broadcast(
          deletedConnection.origin,
          this.createEvents([
            {
              event: FuelConnectorEventTypes.connection,
              params: [result],
            },
          ])
        );
      }
    );
  }

  stop() {
    this.databaseObservable.destroy();
  }
}
