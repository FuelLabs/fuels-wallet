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
    await visit(page, '/networks');
  });

  test.beforeEach(async () => {
    await mockData(page);
  });

  test('should be able to see network list', async () => {
    await hasText(page, 'Local');
    await hasText(page, 'Another');
  });

  test('should be able to update a network', async () => {
    await visit(page, '/networks/update/1');
    await hasText(page, /Update network/i);
    const inputName = await getInputByName(page, 'name');
    await expect(inputName).toBeFocused();
    await inputName.fill('Local 1');
    const urlInput = await getInputByName(page, 'url');
    await expect(urlInput).toHaveValue(VITE_FUEL_PROVIDER_URL);
    const update = await getButtonByText(page, /update/i);
    expect(update).toBeEnabled();
    await update.click();
    await hasText(page, 'Local 1');
  });

  test('should be able to add a new network', async () => {
    getByAriaLabel(page, 'Add network').click();
    const buttonCreate = await getButtonByText(page, /create/i);
    await expect(buttonCreate).toBeDisabled();
    const inputName = await getInputByName(page, 'name');
    await expect(inputName).toBeFocused();
    await inputName.fill('Test Network');
    const urlInput = await getInputByName(page, 'url');
    await urlInput.fill('https://test.network/graphql');
    await expect(buttonCreate).toBeEnabled();
    await buttonCreate.click();
    await hasText(page, 'Test Network');
  });

  test('should be able to select a network', async () => {
    await visit(page, '/wallet');
    const networkSelector = await getByAriaLabel(page, 'Selected Network');
    await expect(networkSelector).toHaveText('Local');
    await visit(page, '/networks');
    await hasText(page, /Another/i);
    const network1 = await getByAriaLabel(page, 'fuel_network-item-1');
    await expect(network1).toHaveAttribute('data-active', 'true');
    const anotherNetwork = await getByAriaLabel(page, 'fuel_network-item-2');
    await anotherNetwork.click();
    await visit(page, '/wallet');
    const selector = await getByAriaLabel(page, 'Selected Network');
    await expect(selector).toHaveText(/Another/i);
  });

  test('should be able to remove a network', async () => {
    await visit(page, '/networks');
    const items = await page.locator('[aria-label*=fuel_network]');
    await expect(items).toHaveCount(2);
    await getByAriaLabel(page, 'Remove').first().click();
    await hasText(page, /Are you absolutely sure/i);
    await getButtonByText(page, /confirm/i).click();
    await expect(items).toHaveCount(1);
    await expect(await items.first()).toHaveAttribute('data-active', 'true');
  });
});
