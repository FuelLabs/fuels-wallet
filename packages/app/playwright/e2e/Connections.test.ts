import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import { getByAriaLabel, hasText, reload, visit } from '../commons';
import type { MockData } from '../mocks';
import { mockData } from '../mocks';

test.describe('Connections', () => {
  let browser: Browser;
  let page: Page;
  let data: MockData;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    data = await mockData(page, 2);
    await reload(page);
  });

  test('disconnect event fires on connection deletion', async () => {
    await visit(page, '/wallet');
    const connectionPromise = new Promise(() => {
      document.addEventListener('connection', (isConnected) => {
        return isConnected;
      });
    });
    await getByAriaLabel(page, 'Menu').click();
    const connectedApps = await hasText(page, 'Connected Apps');
    await connectedApps.click();
    await hasText(page, data.connections[0].origin);
    await getByAriaLabel(page, 'Delete').click();
    expect(connectionPromise).toBeFalsy();
  });
});
