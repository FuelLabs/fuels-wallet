import type { EventMessage } from '@fuel-wallet/types';
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

  beforeEach(() => {
    query = jest.fn(async ({ url }: { url: string }) =>
      url === `${DAPP}/*` ? [{ id: 1 }, { id: 2 }] : []
    );
    sendMessage = jest.fn(async () => {
      throw new Error('Receiving end does not exist');
    });
    const session: Record<string, unknown> = {};
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
        },
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

  it('does not push popup events to tabs', async () => {
    const protocol = new CommunicationProtocol();
    protocol.broadcast(DAPP, { ...event, target: 'FuelPopUpScript' });
    await flush();
    expect(query).not.toHaveBeenCalled();
  });
});
