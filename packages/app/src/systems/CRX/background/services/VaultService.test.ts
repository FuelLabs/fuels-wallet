import { MessageTypes, VAULT_SCRIPT_NAME } from '@fuel-wallet/types';
import { chromeStorage } from '~/systems/Core/services/chromeStorage';

import { loadSecret } from '../../utils';
import { AUTO_LOCK_ALARM, VaultService } from './VaultService';
import { VAULT_V0_63_0 as FIXTURE } from './__fixtures__/vaultV0_63_0';

jest.mock('~/config', () => ({
  ...jest.requireActual('~/config'),
  AUTO_LOCK_IN_MINUTES: 1,
}));

type Listener = (...args: unknown[]) => void;

function createArea(initial: Record<string, unknown> = {}) {
  let store: Record<string, unknown> = { ...initial };
  return {
    get store() {
      return store;
    },
    get: jest.fn(async (keys: string | string[]) => {
      const list = Array.isArray(keys) ? keys : [keys];
      return Object.fromEntries(
        list.filter((k) => k in store).map((k) => [k, store[k]])
      );
    }),
    set: jest.fn(async (items: Record<string, unknown>) => {
      store = { ...store, ...items };
    }),
    remove: jest.fn(async (key: string) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
}

function createEvent() {
  const listeners = new Set<Listener>();
  return {
    addListener: (l: Listener) => listeners.add(l),
    removeListener: (l: Listener) => listeners.delete(l),
    emit: (...args: unknown[]) => {
      for (const l of Array.from(listeners)) l(...args);
    },
  };
}

const EXT_ID = 'ext-id';
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('VaultService', () => {
  let local: ReturnType<typeof createArea>;
  let session: ReturnType<typeof createArea>;
  let onAlarm: ReturnType<typeof createEvent>;
  let protocolListeners: Map<string, Listener>;
  let protocol: {
    ports: Map<string, { name: string; sender: { id: string } }>;
    on: jest.Mock;
    removeListener: jest.Mock;
    postMessage: jest.Mock;
    broadcast: jest.Mock;
  };
  let service: VaultService;

  function setSession(timer: number) {
    local.store.salt = FIXTURE.sessionSalt;
    session.store.data = FIXTURE.sessionData;
    session.store.lockTime = 1;
    session.store.timer = timer;
  }

  // unlock() saves the session secret in the background, wait for it
  async function unlockAndSave() {
    await service.unlock({ password: FIXTURE.password });
    for (let i = 0; i < 100 && !session.store.data; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    await flush();
  }

  async function request(method: string) {
    protocolListeners.get(MessageTypes.request)?.({
      id: 'popup-port',
      target: VAULT_SCRIPT_NAME,
      sender: { id: EXT_ID, origin: `chrome-extension://${EXT_ID}` },
      request: { jsonrpc: '2.0', id: method, method },
    });
    for (let i = 0; i < 100; i++) {
      const call = protocol.postMessage.mock.calls.find(
        ([m]) => m.response?.id === method
      );
      if (call) return call[0].response;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error(`No response for ${method}`);
  }

  beforeEach(() => {
    local = createArea();
    session = createArea();
    onAlarm = createEvent();
    protocolListeners = new Map();
    protocol = {
      ports: new Map(),
      on: jest.fn((event: string, listener: Listener) => {
        protocolListeners.set(event, listener);
      }),
      removeListener: jest.fn(),
      postMessage: jest.fn(),
      broadcast: jest.fn(),
    };
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    (globalThis as any).chrome = {
      runtime: {
        id: EXT_ID,
        onMessage: createEvent(),
        onConnect: createEvent(),
        reload: jest.fn(),
      },
      storage: { local, session },
      alarms: { create: jest.fn(), clear: jest.fn(), onAlarm },
    };
    let vault = {
      key: 'WalletManager',
      data: { key: 'WalletManager', data: FIXTURE.walletManagerState },
    };
    (chromeStorage.vaults.get as jest.Mock).mockImplementation(
      async () => vault
    );
    (chromeStorage.vaults.set as jest.Mock).mockImplementation(
      async (value: typeof vault) => {
        vault = value;
      }
    );
  });

  afterEach(() => {
    service?.stop();
    jest.clearAllMocks();
  });

  it('does not restore the session on worker start', async () => {
    setSession(Date.now() + 60_000);
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    await flush();
    expect(service.manager.isLocked).toBe(true);
    expect(chrome.alarms.create).toHaveBeenCalledWith(AUTO_LOCK_ALARM, {
      when: session.store.timer,
    });
  });

  it('auto unlocks a session saved by v0.63.0 on the first vault request', async () => {
    setSession(Date.now() + 60_000);
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    const response = await request('getAccounts');
    expect(service.manager.isLocked).toBe(false);
    expect(response.result[0].address).toBe(FIXTURE.address);
  }, 30_000);

  it('unlocks a v0.63.0 vault with the password and saves a loadable secret', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    await unlockAndSave();
    const accounts = await service.getAccounts();
    expect(accounts[0].address).toBe(FIXTURE.address);
    expect(await loadSecret()).toBe(FIXTURE.password);
    expect(chrome.alarms.create).toHaveBeenCalledWith(AUTO_LOCK_ALARM, {
      when: session.store.timer,
    });
  }, 30_000);

  it('rejects a wrong password for a v0.63.0 vault', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    await expect(service.unlock({ password: 'wrong' })).rejects.toThrow();
    expect(service.manager.isLocked).toBe(true);
  }, 30_000);

  it('locks and clears the session once the deadline passes', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    await unlockAndSave();
    session.store.timer = Date.now() + 50;
    onAlarm.emit({ name: AUTO_LOCK_ALARM });
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(service.manager.isLocked).toBe(true);
    expect(session.store.data).toBeUndefined();
    expect(local.store.salt).toBeUndefined();
    expect(chrome.alarms.clear).toHaveBeenCalledWith(AUTO_LOCK_ALARM);
  }, 30_000);

  it('keeps the wallet unlocked while the wallet UI is open', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    await unlockAndSave();
    protocol.ports.set('popup-port', {
      name: VAULT_SCRIPT_NAME,
      sender: { id: EXT_ID },
    });
    const expiredSoon = Date.now() + 50;
    session.store.timer = expiredSoon;
    onAlarm.emit({ name: AUTO_LOCK_ALARM });
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(service.manager.isLocked).toBe(false);
    expect(session.store.timer).toBeGreaterThan(expiredSoon + 30_000);

    // Closing the UI schedules the lock for the reset deadline
    protocol.ports.clear();
    protocolListeners.get(MessageTypes.removeConnection)?.('popup-port');
    await flush();
    expect(chrome.alarms.create).toHaveBeenLastCalledWith(AUTO_LOCK_ALARM, {
      when: session.store.timer,
    });
  }, 30_000);

  it('auto unlocks with the new password after a password change', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    await unlockAndSave();
    await service.changePassword({
      currentPassword: FIXTURE.password,
      password: 'NewPassword1$',
    });
    expect(await loadSecret()).toBe('NewPassword1$');
    service.stop();

    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    const response = await request('isLocked');
    expect(response.result).toBe(false);
  }, 30_000);

  it('does not auto unlock after a manual lock and a worker restart', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    await unlockAndSave();
    await service.lock();
    await flush();
    service.stop();

    // biome-ignore lint/suspicious/noExplicitAny: test mock
    service = VaultService.start(protocol as any);
    const response = await request('isLocked');
    expect(response.result).toBe(true);
  }, 30_000);
});
