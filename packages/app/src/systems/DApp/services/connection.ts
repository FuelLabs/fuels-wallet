import type { Account, Connection } from '@fuel-wallet/types';
import type { Maybe } from '~/systems/Core/types';
import { db } from '~/systems/Core/utils/database';

export type ConnectInputs = {
  connection: {
    data: Connection;
  };
  removeConnection: {
    origin: string;
  };
  addAccount: {
    origin: string;
    account: string;
  };
  removeAccount: {
    origin: string;
    account: string;
  };
  updateConnectedAccounts: {
    origin: string;
    accounts: string[];
  };
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ConnectionService {
  static async addConnection(input: ConnectInputs['connection']) {
    return db.transaction('rw', db.connections, async () => {
      await db.connections.add(input.data);
      return db.connections.get({ origin: input.data.origin });
    });
  }

  static async removeConnection({ origin }: ConnectInputs['removeConnection']) {
    return db.transaction('rw', db.connections, async () => {
      const connection = await db.connections.get({ origin });
      await db.connections.delete(origin);
      return connection;
    });
  }

  static async getConnection(origin?: string) {
    return db.transaction('r', db.connections, async () => {
      return db.connections.get({ origin });
    });
  }

  static async clearConnections() {
    return db.transaction('rw', db.connections, async () => {
      return db.connections.clear();
    });
  }

  static async getConnections() {
    return db.transaction('r', db.connections, async () => {
      return db.connections.toArray();
    });
  }

  static getConnectedAccounts(
    connection: Maybe<Connection>,
    accounts: Account[]
  ) {
    const addrs = connection?.accounts || [];
    return addrs.map((a) => accounts.find((acc) => acc.address === a));
  }

  static async removeAccountFrom(input: ConnectInputs['removeAccount']) {
    const { origin, account } = input;
    return db.transaction('rw', db.connections, async () => {
      const connection = await db.connections.get({ origin });
      if (connection) {
        connection.accounts = connection.accounts.filter(
          (acc) => acc !== account
        );
        await db.connections.put(connection);
      }
      return connection;
    });
  }

  static async addAccountTo(input: ConnectInputs['addAccount']) {
    const { origin, account } = input;
    return db.transaction('rw', db.connections, async () => {
      const connection = await db.connections.get({ origin });
      if (connection) {
        connection.accounts = connection.accounts.concat(account);
        await db.connections.put(connection);
      }
      return connection;
    });
  }

  static async updateConnectedAccounts(
    input: ConnectInputs['updateConnectedAccounts']
  ) {
    const { origin, accounts } = input;
    return db.transaction('rw', db.connections, async () => {
      const connection = await db.connections.get({ origin });
      if (connection) {
        connection.accounts = accounts;
        await db.connections.put(connection);
      }
      return connection;
    });
  }

  static filterByOrigin(connections: Connection[], origin = '') {
    if (!origin.length) return null;
    return connections.filter(hasOriginIncluded(origin));
  }

  static findByOrigin(connections: Connection[], origin = '') {
    return connections.find(hasOriginIncluded(origin));
  }

  static excludeByOrigin(connections: Connection[], origin = '') {
    if (!origin.length) return connections;
    return connections.filter((c) => !hasOriginIncluded(origin)(c));
  }
}

function hasOriginIncluded(origin: string) {
  return (connection: Connection) => {
    return connection.origin.toLowerCase().includes(origin.toLowerCase() || '');
  };
}
