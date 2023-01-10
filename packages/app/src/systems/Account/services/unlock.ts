import { waitFor } from 'xstate/lib/waitFor';

import type { UnlockMachineService } from '../machines';

import { Services, store } from '~/store';

export class UnlockService {
  static async getResponse() {
    const service = store.services.get(Services.unlock) as UnlockMachineService;
    const state = service.getSnapshot();
    if (state.matches('unlocking') || state.matches('unlocked')) {
      await waitFor(service, (state) => state.matches('unlocked'));
      const { response } = service?.getSnapshot().context || {};
      return response || { manager: null, wallet: null };
    }
    return { manager: null, wallet: null };
  }

  static async getWalletUnlocked() {
    const response = await UnlockService.getResponse();
    return response.wallet;
  }

  static async getManagerUnlocked() {
    const response = await UnlockService.getResponse();
    return response.manager;
  }
}
