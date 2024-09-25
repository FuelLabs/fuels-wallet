import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getByAriaLabel,
  hasNoText,
  hasText,
  reload,
  visit,
  waitUrl,
} from '../commons';
import { CUSTOM_ASSET_SCREEN, mockData } from '../mocks';

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
    await getByAriaLabel(page, 'Asset ID').fill(CUSTOM_ASSET_SCREEN.assetId);
    await getByAriaLabel(page, 'Asset name').fill(CUSTOM_ASSET_SCREEN.name);
    await getByAriaLabel(page, 'Asset symbol').fill(CUSTOM_ASSET_SCREEN.symbol);
    await getByAriaLabel(page, 'Asset decimals').fill(
      String(CUSTOM_ASSET_SCREEN.decimals)
    );
    await getByAriaLabel(page, 'Asset image Url').fill(
      CUSTOM_ASSET_SCREEN.icon
    );
    await getByAriaLabel(page, 'Save Asset').click();
    await waitUrl(page, '/assets');
    await hasText(page, /Listed/i);
    await getByAriaLabel(page, 'Custom Assets').click();
    await hasText(page, CUSTOM_ASSET_SCREEN.name);
  });

  test('should not be able to add asset with duplicate asset id', async () => {
    const randomName = 'RandomAsset';
    await visit(page, '/assets');
    await hasText(page, /Listed/i);
    await getByAriaLabel(page, 'Add Asset').click();
    await hasText(page, 'Save');
    await getByAriaLabel(page, 'Asset ID').fill(CUSTOM_ASSET_SCREEN.assetId);
    await getByAriaLabel(page, 'Asset name').fill(randomName);
    await getByAriaLabel(page, 'Asset symbol').fill(randomName);
    await getByAriaLabel(page, 'Asset decimals').fill(
      String(CUSTOM_ASSET_SCREEN.decimals)
    );
    await getByAriaLabel(page, 'Asset image Url').fill(
      CUSTOM_ASSET_SCREEN.icon
    );
    await getByAriaLabel(page, 'Save Asset').click();
    await visit(page, '/assets');
    await hasText(page, /Listed/i);
    await getByAriaLabel(page, 'Custom Assets').click();
    await hasNoText(page, randomName);
  });
});
