import type { Application } from '@fuels-wallet/types';

import { db } from '~/systems/Core/utils/database';

export type ConnectInputs = {
  application: {
    data: Application;
  };
};

export class ApplicationService {
  static async addApplication(input: ConnectInputs['application']) {
    return db.transaction('rw', db.applications, async () => {
      await db.applications.add(input.data);
      return db.applications.get({ origin: input.data.origin });
    });
  }

  static async removeApplication(origin: string) {
    return db.transaction('rw', db.applications, async () => {
      return db.applications.delete(origin);
    });
  }

  static async getApplication(origin?: string) {
    return db.transaction('r', db.applications, async () => {
      return db.applications.get({ origin });
    });
  }

  static async clearApplications() {
    return db.transaction('rw', db.applications, async () => {
      return db.applications.clear();
    });
  }

  static async getApplications() {
    return db.transaction('r', db.applications, async () => {
      return db.applications.toArray();
    });
  }
}
