import { db, Storage } from '../utils';

export class CoreService {
  static async clear() {
    await db.clear();
    await Storage.clear();
  }
}
