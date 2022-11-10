import type { Connection } from '@fuel-wallet/types';

import { db } from '~/systems/Core/utils/database';

export type ConnectInputs = {
  connection: {
    data: Connection;
  };
};

export class ConnectionService {
  static async addConnection(input: ConnectInputs['connection']) {
    return db.transaction('rw', db.connections, async () => {
      await db.connections.add(input.data);
      return db.connections.get({ origin: input.data.origin });
    });
  }

  static async removeConnection(origin: string) {
    return db.transaction('rw', db.connections, async () => {
      return db.connections.delete(origin);
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
}
