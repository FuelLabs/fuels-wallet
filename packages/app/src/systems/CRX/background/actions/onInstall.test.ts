const executeContentScript = jest.fn();
jest.mock('../../scripts/executeContentScript', () => ({
  executeContentScript,
}));
jest.mock('../../config', () => ({ welcomeLink: () => 'welcome' }));

// biome-ignore lint/suspicious/noExplicitAny: test storage
let session: Record<string, any>;

function loadWorker() {
  jest.isolateModules(() => {
    require('./onInstall');
  });
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('onInstall', () => {
  beforeEach(() => {
    session = {};
    executeContentScript.mockClear();
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    (globalThis as any).chrome = {
      runtime: {
        onInstalled: { addListener: jest.fn() },
        OnInstalledReason: { INSTALL: 'install' },
      },
      storage: {
        session: {
          get: jest.fn(async (key: string) =>
            key in session ? { [key]: session[key] } : {}
          ),
          set: jest.fn(async (items: object) => Object.assign(session, items)),
        },
      },
      tabs: { create: jest.fn() },
    };
  });

  it('checks open tabs once per extension session', async () => {
    await loadWorker();
    expect(executeContentScript).toHaveBeenCalledTimes(1);

    // A worker restart keeps chrome.storage.session
    await loadWorker();
    expect(executeContentScript).toHaveBeenCalledTimes(1);

    // Re-enabling the extension starts with an empty session
    session = {};
    await loadWorker();
    expect(executeContentScript).toHaveBeenCalledTimes(2);
  });
});
