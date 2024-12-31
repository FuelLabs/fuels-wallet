import { IS_LOGGED_KEY } from '~/config';
import { clearParallelDb } from '~/systems/Core/utils/databaseNoDexie';
import { VaultService } from '~/systems/Vault';
import { db } from '../utils/database';
import { cleanOPFS } from '../utils/opfs';
import { Storage } from '../utils/storage';
import { chromeStorage } from './chromeStorage';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CoreService {
  static async clear() {
    await chromeStorage.clear();
    await VaultService.clear();
    await db.clear();
    Storage.clear();
    await clearParallelDb();
    await cleanOPFS();
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
