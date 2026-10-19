import { ContentProxyConnection } from '@fuel-wallet/connections/src/ContentProxyConnection';

type Listener = (...args: unknown[]) => void;

function createEvent() {
  const listeners = new Set<Listener>();
  return {
    listeners,
    addListener: (l: Listener) => listeners.add(l),
    removeListener: (l: Listener) => listeners.delete(l),
    emit: (...args: unknown[]) => {
      for (const l of Array.from(listeners)) l(...args);
    },
  };
}

function createPort() {
  return {
    onMessage: createEvent(),
    onDisconnect: createEvent(),
    postMessage: jest.fn(),
    disconnect: jest.fn(),
  };
}

const NAME = 'Fuel Wallet';

describe('ContentProxyConnection', () => {
  let ports: Array<ReturnType<typeof createPort>>;
  let runtimeOnMessage: ReturnType<typeof createEvent>;
  let posted: Array<unknown>;
  let connection: ContentProxyConnection;

  function sendFromPage(data: unknown) {
    window.dispatchEvent(
      new MessageEvent('message', { data, origin: window.location.origin })
    );
  }

  beforeEach(() => {
    ports = [];
    posted = [];
    runtimeOnMessage = createEvent();
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    (globalThis as any).chrome = {
      runtime: {
        id: 'ext-id',
        onMessage: runtimeOnMessage,
        connect: jest.fn(() => {
          const port = createPort();
          ports.push(port);
          return port;
        }),
      },
    };
    jest.spyOn(window, 'postMessage').mockImplementation((message: unknown) => {
      posted.push(message);
    });
    connection = ContentProxyConnection.start(NAME);
  });

  afterEach(() => {
    connection.destroy(false);
    jest.restoreAllMocks();
  });

  const startEvent = {
    type: 'event',
    target: 'FuelConnectorScript',
    connectorName: NAME,
    events: [{ event: 'start', params: [] }],
  };

  it('does not open a port on load, but notifies the page', () => {
    expect(chrome.runtime.connect).not.toHaveBeenCalled();
    expect(posted).toEqual([startEvent]);
  });

  it('ignores page messages that do not target the wallet', () => {
    sendFromPage({ type: 'request', target: 'Other', connectorName: NAME });
    sendFromPage({
      type: 'request',
      target: 'FuelContentScript',
      connectorName: 'Other Wallet',
    });
    sendFromPage(null);
    expect(chrome.runtime.connect).not.toHaveBeenCalled();
  });

  it('answers connectorName locally without opening a port', () => {
    sendFromPage({
      type: 'request',
      target: 'FuelContentScript',
      connectorName: NAME,
      request: { jsonrpc: '2.0', id: 1, method: 'connectorName' },
    });
    expect(chrome.runtime.connect).not.toHaveBeenCalled();
    expect(posted[1]).toEqual({
      type: 'response',
      response: { jsonrpc: '2.0', id: 1, result: NAME },
      target: 'FuelConnectorScript',
      connectorName: NAME,
    });
  });

  it('opens the port on the first wallet request and forwards it', () => {
    const message = {
      type: 'request',
      target: 'FuelContentScript',
      connectorName: NAME,
      request: { jsonrpc: '2.0', id: 'a', method: 'ping' },
    };
    sendFromPage(message);
    sendFromPage(message);
    expect(chrome.runtime.connect).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.connect).toHaveBeenCalledWith('ext-id', {
      name: 'FuelBackgroundScript',
    });
    expect(ports[0].postMessage).toHaveBeenCalledTimes(2);
    expect(ports[0].postMessage).toHaveBeenCalledWith({
      ...message,
      target: 'FuelBackgroundScript',
    });
    // No second start event on the first connection
    expect(posted).toEqual([startEvent]);
  });

  it('relays background messages to the page', () => {
    sendFromPage({
      type: 'request',
      target: 'FuelContentScript',
      connectorName: NAME,
      request: { jsonrpc: '2.0', id: 'a', method: 'ping' },
    });
    const response = {
      type: 'response',
      target: 'FuelContentScript',
      response: { jsonrpc: '2.0', id: 'a', result: true },
    };
    ports[0].onMessage.emit(response);
    ports[0].onMessage.emit({ type: 'response', target: 'Other' });
    expect(posted).toEqual([
      startEvent,
      { ...response, target: 'FuelConnectorScript', connectorName: NAME },
    ]);
  });

  it('reconnects after the service worker restarts and re-sends start', () => {
    const message = {
      type: 'request',
      target: 'FuelContentScript',
      connectorName: NAME,
      request: { jsonrpc: '2.0', id: 'a', method: 'ping' },
    };
    sendFromPage(message);
    ports[0].onDisconnect.emit();
    expect(connection.connection).toBeUndefined();

    sendFromPage(message);
    expect(chrome.runtime.connect).toHaveBeenCalledTimes(2);
    expect(ports[1].postMessage).toHaveBeenCalledTimes(1);
    expect(posted).toEqual([startEvent, startEvent]);
  });

  it('keeps answering background pings after the port disconnects', () => {
    sendFromPage({
      type: 'request',
      target: 'FuelContentScript',
      connectorName: NAME,
      request: { jsonrpc: '2.0', id: 'a', method: 'ping' },
    });
    ports[0].onDisconnect.emit();
    const sendResponse = jest.fn();
    runtimeOnMessage.emit({ type: 'ping' }, {}, sendResponse);
    expect(sendResponse).toHaveBeenCalledWith({ type: 'pong' });
  });

  it('removes every listener on full destroy', () => {
    connection.destroy(false);
    expect(runtimeOnMessage.listeners.size).toBe(0);
    sendFromPage({
      type: 'request',
      target: 'FuelContentScript',
      connectorName: NAME,
      request: { jsonrpc: '2.0', id: 'a', method: 'ping' },
    });
    expect(chrome.runtime.connect).not.toHaveBeenCalled();
  });
});
