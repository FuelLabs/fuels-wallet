jest.mock('./contentScript?script', () => 'contentScript.js', {
  virtual: true,
});

import { executeContentScript } from './executeContentScript';

describe('executeContentScript', () => {
  it('injects only into loaded tabs whose content script does not answer', async () => {
    const executeScript = jest.fn(() => Promise.resolve());
    // biome-ignore lint/suspicious/noExplicitAny: test mock
    (globalThis as any).chrome = {
      runtime: {},
      scripting: { executeScript },
      tabs: {
        query: jest.fn((_query, callback) =>
          callback([
            { id: 1, url: 'https://a.example', status: 'complete' },
            { id: 2, url: 'https://b.example', status: 'loading' },
            { id: 3, url: 'https://c.example', status: 'complete', discarded: true },
            { id: 4, url: 'chrome://settings', status: 'complete' },
          ])
        ),
        // No tab answers the ping
        sendMessage: jest.fn((_tabId, _message, callback) => callback(undefined)),
      },
    };

    await executeContentScript();

    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(1);
    expect(executeScript).toHaveBeenCalledTimes(1);
    expect(executeScript).toHaveBeenCalledWith(
      expect.objectContaining({ target: { tabId: 1, allFrames: true } })
    );
  });
});
