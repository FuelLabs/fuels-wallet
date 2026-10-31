import { expect, test } from './human';

import { reload } from '../commons';
import { createConnections, getAccount, mockData } from '../mocks';
import {
  createWalletThroughOnboarding,
  hold,
  readGetStarted,
  seedBaseAsset,
  selectLocalNetwork,
} from './helpers';

test.describe('Get started moments', () => {
  test('checklist, first funds and all set on a new wallet', async ({
    page,
  }) => {
    await createWalletThroughOnboarding(page);

    await test.step('Go to wallet', async () => {
      await page.getByRole('button', { name: 'Go to wallet' }).click();
      await expect(page.getByRole('tab', { name: 'Assets' })).toBeVisible();
    });

    await test.step('Switch to the local node', () => selectLocalNetwork(page));

    const strip = page.getByRole('region', { name: 'Get started' });
    const account = await getAccount(page);

    await test.step('Checklist: receive your first funds', async () => {
      await expect(strip).toBeVisible();
      await expect(strip).toContainText('1/3');
      await expect(strip).toContainText('Receive your first funds');
      await expect
        .poll(async () => (await readGetStarted(page))?.emptyKeys ?? [])
        .toContain(`${process.env.VITE_FUEL_PROVIDER_URL}|${account.address}`);
      await hold(page);
    });

    await test.step('Send funds to the account', async () => {
      await seedBaseAsset(account.address);
    });

    await test.step('First funds received', async () => {
      // Home refreshes balances every 20s while the page is visible.
      await expect(strip).toContainText('First funds received', {
        timeout: 30_000,
      });
      const balance = page
        .locator('.fuel-ticks')
        .filter({ has: page.getByLabel('Total balance in USD') });
      await expect(balance).toHaveCount(1);
      await hold(page);
      await expect(strip).toContainText('2/3');
      await expect(strip).toContainText('Connect to an app');
      expect((await readGetStarted(page))?.funded).toBe(true);
    });

    await test.step('Connect an app', async () => {
      await page.evaluate(
        async (connections) => {
          await window.fuelDB.connections.bulkAdd(connections);
        },
        createConnections([account.address])
      );
      await page.reload();
    });

    await test.step('All set', async () => {
      await expect(strip).toContainText('All set');
      await expect(strip).toHaveAttribute('data-all-set', 'true');
      await hold(page);
      await expect(strip).toBeHidden({ timeout: 5_000 });
      expect((await readGetStarted(page))?.dismissed).toBe(true);
      await hold(page);
    });
  });

  test('dismissing the checklist hides it for good', async ({ page }) => {
    const strip = page.getByRole('region', { name: 'Get started' });

    await test.step('Open Home on a new wallet', async () => {
      await mockData(page);
      await page.evaluate(() => {
        localStorage.setItem('fuel_getStarted', JSON.stringify({}));
      });
      await reload(page);
      await expect(strip).toBeVisible();
      await hold(page);
    });

    await test.step('Dismiss the checklist', async () => {
      await page.getByRole('button', { name: 'Dismiss get started' }).click();
      await expect(strip).toBeHidden();
      expect((await readGetStarted(page))?.dismissed).toBe(true);
    });

    await test.step('Still gone after reload', async () => {
      await reload(page);
      await expect(page.getByRole('tab', { name: 'Assets' })).toBeVisible();
      await expect(strip).toBeHidden();
    });
  });
});
