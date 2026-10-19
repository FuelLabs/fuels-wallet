import type { EventMessage } from '@fuel-wallet/types';
import { CommunicationProtocol } from './CommunicationProtocol';

const DAPP = 'https://dapp.example';
const OTHER = 'https://other.example';

const event: EventMessage = {
  type: 'event',
  target: 'FuelContentScript',
  events: [{ event: 'currentAccount', params: ['0x1'] }],
} as EventMessage;

function createPort(origin: string, tabId?: number) {
  const listeners = { addListener: jest.fn(), removeListener: jest.fn() };
  return {
    sender: { id: 'ext-id', origin, tab: tabId ? { id: tabId } : undefined },
    postMessage: jest.fn(),
    disconnect: jest.fn(),
    onMessage: { ...listeners, hasListener: jest.fn(() => false) },
    onDisconnect: listeners,
  } as unknown as chrome.runtime.Port;
}

describe('CommunicationProtocol.broadcast', () => {
  let query: jest.Mock;
  let sendMessage: jest.Mock;

  beforeEach(() => {
    query = jest.fn(async ({ url }: { url: string }) =>
      url === `${DAPP}/*` ? [{ id: 1 }, { id: 2 }] : []
    );
    sendMessage = jest.fn(async () => {
      throw new Error('Receiving end does not exist');
    });
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    (globalThis as any).chrome = {
      runtime: { id: 'ext-id' },
      tabs: { query, sendMessage },
    };
  });

  it('pushes the event to dApp tabs that have no open port', async () => {
    const protocol = new CommunicationProtocol();
    const port = createPort(DAPP, 1);
    protocol.addConnection(port);

    protocol.broadcast([DAPP, OTHER], event);
    await new Promise((resolve) => setTimeout(resolve, 0));

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

  it('does not push popup events to tabs', async () => {
    const protocol = new CommunicationProtocol();
    protocol.broadcast(DAPP, { ...event, target: 'FuelPopUpScript' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(query).not.toHaveBeenCalled();
  });
});
