import {
  MessageTypes,
  POPUP_SCRIPT_NAME,
  VAULT_SCRIPT_NAME,
} from '@fuel-wallet/types';

import {
  saveSecret,
  loadSecret,
  getTimer,
  clearSession,
  saveTimer,
} from '../../utils';

import type { CommunicationProtocol } from './CommunicationProtocol';

import { AUTO_LOCK_IN_MINUTES } from '~/config';
import { VaultServer } from '~/systems/Vault/services/VaultServer';

export class VaultService extends VaultServer {
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    super();
    this.communicationProtocol = communicationProtocol;
    this.autoLock();
    this.autoUnlock();
    this.setupListeners();
  }

  async unlock({ password }: { password: string }): Promise<void> {
    await super.unlock({ password });
    saveSecret(password, AUTO_LOCK_IN_MINUTES);
  }

  async lock(): Promise<void> {
    await super.lock();
    this.emitLockEvent();
  }

  async isLocked(): Promise<boolean> {
    const isWalletLocked = await super.isLocked();
    if (!isWalletLocked) {
      const timer = await getTimer();
      if (timer) {
        // Saving a new timestamp for wallet auto lock
        saveTimer(AUTO_LOCK_IN_MINUTES);
      }
    }
    return isWalletLocked;
  }

  async autoLock() {
    // Check every second if the timer has expired
    // If so, clear the secret and lock the vault
    setInterval(async () => {
      const timer = await getTimer();
      if (timer === 0) return;
      if (timer < Date.now()) {
        clearSession();
        this.lock();
      }
    }, 1000);
  }

  async autoUnlock() {
    const secret = await loadSecret();
    if (secret) {
      await super.unlock({ password: secret });
    }
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new VaultService(communicationProtocol);
  }

  setupListeners() {
    this.communicationProtocol.on(MessageTypes.request, async (event) => {
      if (!event.sender?.origin?.includes(chrome.runtime.id)) return;
      if (event.sender?.id !== chrome.runtime.id) return;
      if (event.target !== VAULT_SCRIPT_NAME) return;
      const response = await this.server.receive(event.request);
      if (response) {
        this.communicationProtocol.postMessage({
          id: event.id,
          type: MessageTypes.response,
          target: POPUP_SCRIPT_NAME,
          response,
        });
      }
    });
  }

  emitLockEvent() {
    // Get all current Wallet PopUp instances to emit the lock event
    const origins = Array.from(this.communicationProtocol.ports.values())
      .filter((p) => p.sender?.id === chrome.runtime.id)
      .map((p) => p.sender?.origin) as Array<string>;
    // Broadcast the lock event
    this.communicationProtocol.broadcast(origins, {
      type: MessageTypes.event,
      target: POPUP_SCRIPT_NAME,
      events: [
        {
          event: 'lock',
          params: [],
        },
      ],
    });
  }
}
