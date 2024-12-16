import { VaultService } from '~/systems/Vault';
import { db } from '../utils/database';
import { Storage } from '../utils/storage';
import { chromeStorage } from './chromeStorage';
import { clearParallelDb } from '~/systems/Core/utils/databaseNoDexie';
import { IS_LOGGED_KEY } from '~/config';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CoreService {
  static async clear() {
    await chromeStorage.clear();
    await VaultService.clear();
    await db.clear();
    Storage.clear();
    await clearParallelDb();
    const reloadAfterCleanCompleted = () => {
      const isLogged = Storage.getItem(IS_LOGGED_KEY);
      if (!isLogged) {
        window.location.reload();
        return;
      }
      setTimeout(() => reloadAfterCleanCompleted(), 50);
    };
    reloadAfterCleanCompleted();
  }
}
