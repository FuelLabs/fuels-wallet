import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import {
  visit,
  getByAriaLabel,
  getInputByName,
  getButtonByText,
  hasText,
} from '../commons';
import { mockData } from '../mocks';

const { VITE_FUEL_PROVIDER_URL } = process.env;

test.describe('Networks', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    await mockData(page);
  });

  test('should be able to see network list', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, 'Local');
    await hasText(page, 'Another');
  });

  test('should be able to select a network', async () => {
    await visit(page, '/wallet');
    const networkSelector = await getByAriaLabel(page, 'Selected Network');
    await expect(networkSelector).toHaveText('Local');
    await networkSelector.click();
    await hasText(page, /Another/i);
    const network1 = await getByAriaLabel(page, 'fuel_network-item-1');
    await expect(network1).toHaveAttribute('data-active', 'true');
    const anotherNetwork = await getByAriaLabel(page, 'fuel_network-item-2');
    await anotherNetwork.click();
    await page.waitForTimeout(1000);
    await visit(page, '/wallet');
    const selector = await getByAriaLabel(page, 'Selected Network');
    await expect(selector).toHaveText(/Another/i);
  });

  test('should be able to update a network', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, /Networks/i);
    await getByAriaLabel(page, 'Update').first().click();
    await hasText(page, /Update network/i);
    const urlInput = await getInputByName(page, 'url');
    await expect(urlInput).toHaveValue(VITE_FUEL_PROVIDER_URL);
    const inputName = await getInputByName(page, 'name');
    await expect(inputName).toBeFocused();
    await inputName.fill('Local 1');
    const update = await getButtonByText(page, /update/i);
    expect(update).toBeEnabled();
    await update.click();
    await hasText(page, 'Local 1');
  });

  test('should be able to remove a network', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    const items = await page.locator('[aria-label*=fuel_network]');
    await expect(items).toHaveCount(2);
    await getByAriaLabel(page, 'Remove').first().click();
    await hasText(page, /Are you sure/i);
    await getButtonByText(page, /confirm/i).click();
    await expect(items).toHaveCount(1);
    await expect(await items.first()).toHaveAttribute('data-active', 'true');
  });

  test('should be able to add a new network', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, /Add new network/i);
    await getByAriaLabel(page, 'Add network').click();
    const buttonCreate = await getButtonByText(page, /add/i);
    await expect(buttonCreate).toBeDisabled();
    const urlInput = await getInputByName(page, 'url');
    await expect(urlInput).toBeFocused();
    await urlInput.fill('https://beta-3.fuel.network/graphql');
    await page.waitForTimeout(3500); // Wait to fetch `chainInfo`
    await hasText(page, /Testnet Beta 3/i);
    await expect(buttonCreate).toBeEnabled();
    await buttonCreate.click();
    await getByAriaLabel(page, 'Menu').click();
    await page.locator(`[data-key="networks"]`).click();
    await hasText(page, 'Testnet Beta 3');
  });
});
