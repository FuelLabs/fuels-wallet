import type { EventMessage } from '@fuel-wallet/types';
import { clearSession } from '../../utils/secret';
import { CommunicationProtocol } from './CommunicationProtocol';

const DAPP = 'https://dapp.example';
const OTHER = 'https://other.example';

const event: EventMessage = {
  type: 'event',
  target: 'FuelContentScript',
  events: [{ event: 'currentAccount', params: ['0x1'] }],
} as EventMessage;

function createPort(origin: string, tabId?: number, frameId = 0) {
  const listeners = { addListener: jest.fn(), removeListener: jest.fn() };
  return {
    sender: {
      id: 'ext-id',
      origin,
      frameId,
      tab: tabId ? { id: tabId } : undefined,
    },
    postMessage: jest.fn(),
    disconnect: jest.fn(),
    onMessage: { ...listeners, hasListener: jest.fn(() => false) },
    onDisconnect: listeners,
  } as unknown as chrome.runtime.Port;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 20));

describe('CommunicationProtocol.broadcast', () => {
  let query: jest.Mock;
  let sendMessage: jest.Mock;
  let onTabRemoved: ((tabId: number) => void) | undefined;
  let session: Record<string, unknown>;
  let local: Record<string, unknown>;

  beforeEach(() => {
    query = jest.fn(async ({ url }: { url: string }) =>
      url === `${DAPP}/*` ? [{ id: 1 }, { id: 2 }] : []
    );
    sendMessage = jest.fn(async () => {
      throw new Error('Receiving end does not exist');
    });
    session = {};
    local = {};
    const remove =
      (store: Record<string, unknown>) => async (keys: string | string[]) => {
        for (const key of [keys].flat()) delete store[key];
      };
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    (globalThis as any).chrome = {
      runtime: { id: 'ext-id' },
      tabs: {
        query,
        sendMessage,
        onRemoved: {
          addListener: (fn: (tabId: number) => void) => {
            onTabRemoved = fn;
          },
        },
      },
      storage: {
        session: {
          get: async (key: string) => ({ [key]: session[key] }),
          set: async (items: Record<string, unknown>) => {
            Object.assign(session, items);
          },
          remove: remove(session),
        },
        local: { remove: remove(local) },
      },
    };
  });

  it('pushes the event to dApp tabs that have no open port', async () => {
    const protocol = new CommunicationProtocol();
    const port = createPort(DAPP, 1);
    protocol.addConnection(port);

    protocol.broadcast([DAPP, OTHER], event);
    await flush();

    expect(port.postMessage).toHaveBeenCalledWith(event);
    expect(query).toHaveBeenCalledWith({ url: `${DAPP}/*` });
    expect(query).toHaveBeenCalledWith({ url: `${OTHER}/*` });
    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith(
      2,
      { type: 'event', origin: DAPP, message: event },
      { frameId: 0 }
    );
  });

  it('reaches an iframed dApp after its port closed', async () => {
    const protocol = new CommunicationProtocol();
    const port = createPort(DAPP, 3, 5);
    protocol.addConnection(port);
    protocol.removePort(protocol.getPortId(port)!);
    sendMessage.mockResolvedValue(undefined);

    protocol.broadcast(DAPP, event);
    await flush();

    expect(sendMessage).toHaveBeenCalledWith(
      3,
      { type: 'event', origin: DAPP, message: event },
      { frameId: 5 }
    );
  });

  it('skips iframes that still have an open port', async () => {
    const protocol = new CommunicationProtocol();
    const port = createPort(DAPP, 3, 5);
    protocol.addConnection(port);

    protocol.broadcast(DAPP, event);
    await flush();

    expect(port.postMessage).toHaveBeenCalledWith(event);
    expect(sendMessage).not.toHaveBeenCalledWith(3, expect.anything(), {
      frameId: 5,
    });
  });

  it('forgets frames when their tab closes', async () => {
    const protocol = new CommunicationProtocol();
    const port = createPort(DAPP, 3, 5);
    protocol.addConnection(port);
    protocol.removePort(protocol.getPortId(port)!);
    onTabRemoved?.(3);
    await flush();

    protocol.broadcast(DAPP, event);
    await flush();

    expect(sendMessage).not.toHaveBeenCalledWith(3, expect.anything(), {
      frameId: 5,
    });
  });

  it('keeps a frame that reconnected before a failed delivery settled', async () => {
    const protocol = new CommunicationProtocol();
    const old = createPort(DAPP, 3, 5);
    protocol.addConnection(old);
    protocol.removePort(protocol.getPortId(old)!);
    let failDelivery: (error: Error) => void = () => {};
    sendMessage.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          failDelivery = reject;
        })
    );

    protocol.broadcast(DAPP, event);
    await flush();
    const reloaded = createPort(DAPP, 3, 5);
    protocol.addConnection(reloaded);
    protocol.removePort(protocol.getPortId(reloaded)!);
    failDelivery(new Error('Receiving end does not exist'));
    await flush();
    sendMessage.mockClear();
    sendMessage.mockResolvedValue(undefined);

    protocol.broadcast(DAPP, event);
    await flush();

    expect(sendMessage).toHaveBeenCalledWith(
      3,
      { type: 'event', origin: DAPP, message: event },
      { frameId: 5 }
    );
  });

  it('does not let a stale origin block the live one in the same frame', async () => {
    const protocol = new CommunicationProtocol();
    const stale = createPort(OTHER, 3, 0);
    protocol.addConnection(stale);
    protocol.removePort(protocol.getPortId(stale)!);
    query.mockImplementation(async ({ url }: { url: string }) =>
      url === `${DAPP}/*` ? [{ id: 3 }] : []
    );

    protocol.broadcast([OTHER, DAPP], event);
    await flush();

    expect(sendMessage).toHaveBeenCalledWith(
      3,
      { type: 'event', origin: OTHER, message: event },
      { frameId: 0 }
    );
    expect(sendMessage).toHaveBeenCalledWith(
      3,
      { type: 'event', origin: DAPP, message: event },
      { frameId: 0 }
    );
  });

  it('still reaches an idle iframe after the wallet locks', async () => {
    const protocol = new CommunicationProtocol();
    const port = createPort(DAPP, 3, 5);
    protocol.addConnection(port);
    protocol.removePort(protocol.getPortId(port)!);
    await flush();
    Object.assign(session, { data: 'secret', timer: 1, lockTime: 5 });
    local.salt = 'salt';
    sendMessage.mockResolvedValue(undefined);

    await clearSession();
    protocol.broadcast(DAPP, event);
    await flush();

    expect(session.data).toBeUndefined();
    expect(session.timer).toBeUndefined();
    expect(session.lockTime).toBeUndefined();
    expect(local.salt).toBeUndefined();
    expect(sendMessage).toHaveBeenCalledWith(
      3,
      { type: 'event', origin: DAPP, message: event },
      { frameId: 5 }
    );
  });

  it('does not push popup events to tabs', async () => {
    const protocol = new CommunicationProtocol();
    protocol.broadcast(DAPP, { ...event, target: 'FuelPopUpScript' });
    await flush();
    expect(query).not.toHaveBeenCalled();
  });
});
