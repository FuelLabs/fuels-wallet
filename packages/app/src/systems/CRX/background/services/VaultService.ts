import {
  MessageTypes,
  POPUP_SCRIPT_NAME,
  VAULT_SCRIPT_NAME,
} from '@fuel-wallet/types';
import type { DatabaseRestartEvent, RequestMessage } from '@fuel-wallet/types';
import { AUTO_LOCK_IN_MINUTES } from '~/config';
import { VaultServer } from '~/systems/Vault/services/VaultServer';
import lockTimer from '../../utils/lockTimer';

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

  private autoLockInterval: NodeJS.Timeout | null = null;

  constructor(communicationProtocol: CommunicationProtocol) {
    super();
    // Bind methods to ensure correct `this` context
    this.handleRequest = this.handleRequest.bind(this);
    this.handleRestartEvent = this.handleRestartEvent.bind(this);
    this.emitLockEvent = this.emitLockEvent.bind(this);

    this.communicationProtocol = communicationProtocol;

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
    this.startAutoLockTimer();
  }

  async lock(): Promise<void> {
    await super.lock();
    this.stopAutoLockTimer();
    this.emitLockEvent();
  }

  private startAutoLockTimer() {
    this.stopAutoLockTimer(); // Clear any existing interval

    this.autoLockInterval = setInterval(async () => {
      const timer = await getTimer();

      if (timer === 0) return;

      // Get all current Wallet PopUp instances that are using VaultService
      const origins = Array.from(
        this.communicationProtocol.ports.values()
      ).filter((p) => p.name === VAULT_SCRIPT_NAME);

      // If we're using the wallet, let's reset the auto lock
      const isVaultInUse = origins.length > 0;
      if (isVaultInUse) {
        await resetTimer();
        return;
      }

      // Otherwise, we can check if the autolock time is expired
      const isExpired = timer < Date.now();
      if (isExpired) {
        clearSession();
        this.lock();
      }
    }, 1000);
  }

  private stopAutoLockTimer() {
    if (this.autoLockInterval) {
      clearInterval(this.autoLockInterval);
      this.autoLockInterval = null;
    }
  }

  async autoUnlock() {
    const secret = await loadSecret();
    if (secret) {
      // Unlock vault directly without saving a new timestamp
      await super.unlock({ password: secret });
      this.startAutoLockTimer(); // Start the timer after unlocking
    }
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new VaultService(communicationProtocol);
  }

  private async handleRequest(event: RequestMessage) {
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
  }

  private async handleRestartEvent(message: DatabaseRestartEvent) {
    const { type: eventType, payload } = message ?? {};
    const connected = await db
      .open()
      .then((db) => db.isOpen())
      .catch(() => false);

    if (!connected) {
      return this.reload();
    }

    const integrity = await this.checkVaultIntegrity();

    if (eventType === 'DB_EVENT' && payload.event === 'restarted') {
      if (!integrity) {
        return this.reload();
      }
    }

    return;
  }

  private setupListeners() {
    chrome.runtime.onMessage.addListener(this.handleRestartEvent);
    this.communicationProtocol.on(MessageTypes.request, this.handleRequest);
    this.on('lock', this.emitLockEvent);
  }

  stop() {
    this.stopAutoLockTimer();
    this.communicationProtocol.removeListener(
      MessageTypes.request,
      this.handleRequest
    );
    chrome.runtime.onMessage.removeListener(this.handleRestartEvent);
    this.removeListener('lock', this.emitLockEvent);
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
