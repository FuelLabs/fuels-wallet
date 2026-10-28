import {
  MessageTypes,
  POPUP_SCRIPT_NAME,
  VAULT_SCRIPT_NAME,
} from '@fuel-wallet/types';
import type { DatabaseRestartEvent, RequestMessage } from '@fuel-wallet/types';
import { AUTO_LOCK_IN_MINUTES } from '~/config';
import {
  type VaultInputs,
  VaultServer,
} from '~/systems/Vault/services/VaultServer';

import {
  clearSession,
  getTimer,
  isExtensionOrigin,
  loadSecret,
  resetTimer,
  saveSecret,
} from '../../utils';

import { db } from '../../../../systems/Core/utils/database';
import type { CommunicationProtocol } from './CommunicationProtocol';

export const AUTO_LOCK_ALARM = 'autoLock';
const IN_USE_TIMER_RESET_INTERVAL = 1000;
const MAX_SET_TIMEOUT_DELAY = 2 ** 31 - 1;

export class VaultService extends VaultServer {
  readonly communicationProtocol: CommunicationProtocol;

  private autoLockTimeout: ReturnType<typeof setTimeout> | null = null;
  private autoUnlockPromise: Promise<void> | null = null;

  constructor(communicationProtocol: CommunicationProtocol) {
    super();
    // Bind methods to ensure correct `this` context
    this.handleRequest = this.handleRequest.bind(this);
    this.handleRestartEvent = this.handleRestartEvent.bind(this);
    this.emitLockEvent = this.emitLockEvent.bind(this);
    this.checkAutoLock = this.checkAutoLock.bind(this);
    this.handleAlarm = this.handleAlarm.bind(this);
    this.handleConnect = this.handleConnect.bind(this);

    this.communicationProtocol = communicationProtocol;

    this.setupListeners();
    this.checkAutoLock();
  }

  async checkVaultIntegrity() {
    // Ensure integrity of database
    const vaultsCount = await db.table('vaults').count();
    const accsCount = await db.table('accounts').count();

    return !!(vaultsCount && accsCount);
  }

  async unlock({ password }: { password: string }): Promise<void> {
    await super.unlock({ password });
    // Not awaited so the unlock response does not wait for the encryption
    saveSecret(password, AUTO_LOCK_IN_MINUTES).then(() => {
      // Locked again while saving, do not leave a usable session behind
      if (this.manager.isLocked) return clearSession();
      return this.checkAutoLock();
    });
  }

  async changePassword(input: VaultInputs['changePassword']): Promise<void> {
    await super.changePassword(input);
    // Keep the session secret in sync, auto unlock would fail with the old one
    if (!this.manager.isLocked) {
      await saveSecret(input.password, AUTO_LOCK_IN_MINUTES);
      this.checkAutoLock();
    }
  }

  async lock(): Promise<void> {
    await super.lock();
    this.stopAutoLockTimer();
    chrome.alarms.clear(AUTO_LOCK_ALARM);
    // Otherwise the next worker start would auto unlock a manually locked wallet
    clearSession();
    this.emitLockEvent();
  }

  private isVaultInUse() {
    return Array.from(this.communicationProtocol.ports.values()).some(
      (p) => p.name === VAULT_SCRIPT_NAME
    );
  }

  private async checkAutoLock() {
    this.stopAutoLockTimer();
    const timer = await getTimer();

    if (timer === 0) return;

    if (this.isVaultInUse()) {
      await resetTimer();
      this.scheduleAutoLockCheck(IN_USE_TIMER_RESET_INTERVAL);
      return;
    }

    const remaining = timer - Date.now();
    if (remaining < 0) {
      // Let an in-flight auto unlock finish so it cannot unlock after this lock
      await this.autoUnlockPromise;
      this.lock();
      return;
    }

    this.scheduleAutoLockCheck(remaining);
    // Wakes the worker at the deadline if it is suspended before the timeout fires
    chrome.alarms.create(AUTO_LOCK_ALARM, { when: timer });
  }

  private scheduleAutoLockCheck(delay: number) {
    this.stopAutoLockTimer();
    this.autoLockTimeout = setTimeout(
      this.checkAutoLock,
      Math.min(delay, MAX_SET_TIMEOUT_DELAY)
    );
  }

  private stopAutoLockTimer() {
    if (this.autoLockTimeout) {
      clearTimeout(this.autoLockTimeout);
      this.autoLockTimeout = null;
    }
  }

  private handleAlarm(alarm: chrome.alarms.Alarm) {
    if (alarm.name === AUTO_LOCK_ALARM) {
      this.checkAutoLock();
    }
  }

  private handleConnect(port: chrome.runtime.Port) {
    if (port.name !== VAULT_SCRIPT_NAME) return;
    // Wait for the port to be registered in the communication protocol
    setTimeout(this.checkAutoLock, 0);
  }

  async autoUnlock() {
    const secret = await loadSecret();
    if (secret) {
      // Unlock vault directly without saving a new timestamp
      await super.unlock({ password: secret });
    }
  }

  // Worker wakes that never touch the vault skip the key derivation
  private ensureAutoUnlocked() {
    if (!this.autoUnlockPromise) {
      this.autoUnlockPromise = this.autoUnlock().catch(() => {});
    }
    return this.autoUnlockPromise;
  }

  static start(communicationProtocol: CommunicationProtocol) {
    return new VaultService(communicationProtocol);
  }

  private async handleRequest(event: RequestMessage) {
    if (!isExtensionOrigin(event.sender?.origin)) return;
    if (event.sender?.id !== chrome.runtime.id) return;
    if (event.target !== VAULT_SCRIPT_NAME) return;
    await this.ensureAutoUnlocked();
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
    chrome.runtime.onConnect.addListener(this.handleConnect);
    chrome.alarms.onAlarm.addListener(this.handleAlarm);
    this.communicationProtocol.on(MessageTypes.request, this.handleRequest);
    this.communicationProtocol.on(
      MessageTypes.removeConnection,
      this.checkAutoLock
    );
    this.on('lock', this.emitLockEvent);
  }

  // Keeps the auto-lock alarm, so a suspended worker still wakes to lock
  stop() {
    this.stopAutoLockTimer();
    this.communicationProtocol.removeListener(
      MessageTypes.request,
      this.handleRequest
    );
    this.communicationProtocol.removeListener(
      MessageTypes.removeConnection,
      this.checkAutoLock
    );
    chrome.runtime.onMessage.removeListener(this.handleRestartEvent);
    chrome.runtime.onConnect.removeListener(this.handleConnect);
    chrome.alarms.onAlarm.removeListener(this.handleAlarm);
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
