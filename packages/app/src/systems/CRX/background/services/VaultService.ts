import {
  type DatabaseRestartEvent,
  POPUP_SCRIPT_NAME,
  VAULT_SCRIPT_NAME,
} from '@fuel-wallet/types';
import { MessageTypes, type RequestMessage } from '@fuels/connectors';
import { AUTO_LOCK_IN_MINUTES } from '~/config';
import { VaultServer } from '~/systems/Vault/services/VaultServer';

import {
  clearSession,
  getTimer,
  loadSecret,
  resetTimer,
  saveSecret,
} from '../../utils';

import { db } from '../../../../systems/Core/utils/database';
import type { CommunicationProtocol } from './CommunicationProtocol';

export class VaultService extends VaultServer {
  readonly communicationProtocol: CommunicationProtocol;

  constructor(communicationProtocol: CommunicationProtocol) {
    super();
    this.communicationProtocol = communicationProtocol;
    this.autoLock();
    this.autoUnlock();
    this.setupListeners();
  }

  async checkVaultIntegrity() {
    // Ensure integrity of database
    const vaultsCount = await db.table('vaults').count();
    const accsCount = await db.table('accounts').count();

    return !!(vaultsCount && accsCount);
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
        // Reset the timer for wallet auto lock
        resetTimer();
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
      // Unlock vault directly without saving a new timestamp
      await super.unlock({ password: secret });
    }
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new VaultService(communicationProtocol);
  }

  setupListeners() {
    const handleRequest = async (event: RequestMessage) => {
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
    };

    const handleRestartEvent = async (message: DatabaseRestartEvent) => {
      const { type: eventType, payload } = message ?? {};
      const integrity = await this.checkVaultIntegrity();
      const connected = await db
        .open()
        .then((db) => db.isOpen())
        .catch(() => false);

      if (!connected) {
        return this.reload();
      }

      if (eventType === 'DB_EVENT' && payload.event === 'restarted') {
        if (!integrity) {
          chrome.storage.local.set({ shouldRecoverWelcomeFromError: true });
          return this.resetAndReload();
        }
      }
    };
    chrome.runtime.onMessage.addListener(handleRestartEvent);
    this.communicationProtocol.on(MessageTypes.request, handleRequest);
    // Broadcast the lock event
    this.on('lock', () => {
      this.emitLockEvent();
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
