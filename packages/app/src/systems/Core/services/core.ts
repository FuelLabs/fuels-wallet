import { db } from '../utils/database';
import { Storage } from '../utils/storage';

export class CoreService {
  static async clear() {
    await db.clear();
    if (typeof localStorage !== 'undefined') {
      await Storage.clear();
    }
  }
}
