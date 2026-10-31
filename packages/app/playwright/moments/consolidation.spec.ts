import { expect, test } from '@playwright/test';
import { Mnemonic } from 'fuels';

import { visit } from '../commons';
import { DEFAULT_NETWORKS, createManager, mockData, unlock } from '../mocks';
import { hold, maxInputs, seedManyCoins } from './helpers';

/* Enough for three consolidation transactions at 255 inputs each. */
const COINS = 600;
/* Local fuel-core confirms instantly; slow each submit so the progress is watchable. */
const SUBMIT_DELAY_MS = 1500;

test.describe('Coin consolidation moments', () => {
  test('consolidate many small coins with per-transaction progress', async ({
    page,
  }) => {
    const mnemonic = Mnemonic.generate(16);
    const manager = await createManager(mnemonic);
    const address = manager.getAccounts()[0].address.toString();
    const limit = await maxInputs();
    const expectedTxs = Math.ceil(COINS / limit);

    await test.step(`Seed ${COINS} small coins`, async () => {
      expect(COINS).toBeGreaterThan(limit * 2);
      await seedManyCoins(address, COINS);
    });

    await test.step('Open the wallet', async () => {
      await mockData(page, 1, DEFAULT_NETWORKS, mnemonic);
      await unlock(page);
      await visit(page, '/wallet');
    });

    await test.step('Home offers to consolidate', async () => {
      const cta = page.getByText('Consolidate coins', { exact: true });
      await expect(cta).toBeVisible({ timeout: 30_000 });
      await hold(page);
      await cta.click();
    });

    await test.step('Consolidation required', async () => {
      await expect(
        page.getByText('Account Consolidation Required')
      ).toBeVisible({ timeout: 30_000 });
      await hold(page);
    });

    await page.route('**/v1/graphql', async (route) => {
      const body = route.request().postData() ?? '';
      if (/mutation\s+\w*[sS]ubmit/.test(body)) {
        await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
      }
      await route.continue();
    });

    const squares = page.locator('li.fuel-square');
    const status = page.locator('p[role="status"].status');

    await test.step('Consolidating: one square per transaction', async () => {
      await page.getByRole('button', { name: 'Consolidate' }).click();
      await expect(
        page.getByRole('heading', { name: 'Consolidating coins' })
      ).toBeVisible();
      await expect(squares).toHaveCount(expectedTxs);
      await expect(
        page.locator('li.fuel-square[data-kind="active"]')
      ).toHaveCount(1);
      await expect(status).toHaveText(
        new RegExp(`Transaction \\d of ${expectedTxs}`)
      );
      await hold(page);
    });

    await test.step('Last transaction going out', async () => {
      await expect(status).toHaveText(
        `Transaction ${expectedTxs} of ${expectedTxs}`,
        { timeout: 60_000 }
      );
      await expect(squares.first()).not.toHaveAttribute('data-kind');
      await hold(page);
    });

    await test.step('Coins consolidated', async () => {
      await expect(
        page.getByRole('heading', { name: 'Coins consolidated' })
      ).toBeVisible({ timeout: 60_000 });
      await expect(status).toHaveText(
        `${COINS} coins combined in ${expectedTxs} transactions.`
      );
      await expect(squares).toHaveCount(expectedTxs);
      for (let i = 0; i < expectedTxs; i++) {
        await expect(squares.nth(i)).not.toHaveAttribute('data-kind');
      }
      await hold(page, 3000);
    });

    await test.step('Done: back to Home', async () => {
      await page.unroute('**/v1/graphql');
      await page.getByRole('button', { name: 'Done' }).click();
      await expect(page.getByRole('tab', { name: 'Assets' })).toBeVisible();
      // The banner fades out with opacity; its wrapper carries the open state.
      await expect(
        page.locator('[data-open]').filter({ hasText: 'Consolidate coins' })
      ).toHaveAttribute('data-open', 'false', { timeout: 30_000 });
      await hold(page);
    });
  });
});
