import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getByAriaLabel, hasText, reload, visit, waitUrl } from '../commons';
import { mockData } from '../mocks';

test.describe('Asset', () => {
  let browser: Browser;
  let page: Page;
  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    await mockData(page, 2);
    await reload(page);
  });

  test('should be able to add asset', async () => {
    await visit(page, '/assets');
    await hasText(page, /Listed/i);
    await getByAriaLabel(page, 'Add Asset').click();
    await hasText(page, 'Add Asset');
    const assetToAdd = {
      assetId: '0x0000000000212121',
      name: 'CUSTOM',
      symbol: 'CUST',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png',
    };
    await getByAriaLabel(page, 'Asset ID').type(assetToAdd.assetId);
    await getByAriaLabel(page, 'Asset name').type(assetToAdd.name);
    await getByAriaLabel(page, 'Asset symbol').type(assetToAdd.symbol);
    await getByAriaLabel(page, 'Asset imageUrl').type(assetToAdd.imageUrl);
    await getByAriaLabel(page, 'Save Asset').click();
    await waitUrl(page, '/assets');
    await hasText(page, /Listed/i);
    await getByAriaLabel(page, 'Custom Assets').click();
    await hasText(page, assetToAdd.name);
  });
});
