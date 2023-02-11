import { db, Storage } from '../utils';

export class CoreService {
  static async clear() {
    await db.clear();
    if (typeof localStorage !== 'undefined') {
      await Storage.clear();
    }
  }
}
