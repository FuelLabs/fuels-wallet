import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getByAriaLabel, hasText, reload, visit, waitUrl } from '../commons';
import { CUSTOM_ASSET, mockData } from '../mocks';

test.describe('Asset', () => {
  let browser: Browser;
  let page: Page;
  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    await mockData(page, 1);
    await reload(page);
  });

  test('should be able to add asset', async () => {
    await visit(page, '/assets');
    await hasText(page, /Listed/i);
    await getByAriaLabel(page, 'Add Asset').click();
    await hasText(page, 'Save');
    await getByAriaLabel(page, 'Asset ID').type(CUSTOM_ASSET.assetId);
    await getByAriaLabel(page, 'Asset name').type(CUSTOM_ASSET.name);
    await getByAriaLabel(page, 'Asset symbol').type(CUSTOM_ASSET.symbol);
    await getByAriaLabel(page, 'Asset decimals').type(
      String(CUSTOM_ASSET.decimals),
    );
    await getByAriaLabel(page, 'Asset image Url').type(CUSTOM_ASSET.imageUrl);
    await getByAriaLabel(page, 'Save Asset').click();
    await waitUrl(page, '/assets');
    await hasText(page, /Listed/i);
    await getByAriaLabel(page, 'Custom Assets').click();
    await hasText(page, CUSTOM_ASSET.name);
  });
});
