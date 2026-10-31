import { expect, test } from '@playwright/test';

import { visit } from '../commons';
import { mockData } from '../mocks';
import { hold } from './helpers';

test.describe('Success language moments', () => {
  test('a new account lands on the balance widget', async ({ page }) => {
    await test.step('Open Home', async () => {
      await mockData(page, 1);
      await visit(page, '/wallet');
      await expect(page.getByLabel('Account 1 selected')).toBeVisible();
      await hold(page);
    });

    await test.step('Add an account', async () => {
      await page.getByLabel('Accounts').click();
      await page.getByLabel('Add account').click();
    });

    await test.step('New account lands on Home', async () => {
      await expect(page.getByLabel('Account 2 selected')).toBeVisible();
      const widget = page
        .locator('.fuel-ticks')
        .filter({ has: page.getByLabel('Total balance in USD') });
      await expect(widget).toHaveCount(1);
      await hold(page);
      await expect(widget).toHaveCount(0, { timeout: 5_000 });
    });
  });

  test('a new network lands on the network selector', async ({ page }) => {
    const url = 'http://127.0.0.1:4000/v1/graphql';
    const selector = page.getByLabel('Selected Network');

    await test.step('Open Home', async () => {
      await mockData(page);
      await visit(page, '/wallet');
      await expect(selector).toBeVisible();
    });

    await test.step('Add a network', async () => {
      await selector.click();
      await page.getByLabel('Add network').click();
      await page.locator('input[name="url"]').fill(url);
      await page.locator('input[name="chainId"]').fill('0');
      const testConnection = page.getByLabel('Test connection');
      await expect(testConnection).toBeEnabled({ timeout: 15_000 });
      await testConnection.click();
      const add = page.getByRole('button', { name: /^add/i });
      await expect(add).toBeEnabled({ timeout: 15_000 });
      await hold(page);
      await add.click();
    });

    await test.step('New network lands on the selector', async () => {
      await expect(selector).toHaveClass(/fuel-courier-hit/);
      await hold(page);
      await expect(selector).not.toHaveClass(/fuel-courier-hit/, {
        timeout: 5_000,
      });
    });
  });
});
