import { expect, test } from './human';
import { bn } from 'fuels';

import { reload, seedWallet, visit } from '../commons';
import { mockData } from '../mocks';
import { hold } from './helpers';

type SeenAssets = Record<string, string[]>;

test.describe('New asset markers', () => {
  test('assets that arrived since the last look are marked New once', async ({
    page,
  }) => {
    const { accounts } = await mockData(page);
    const address = accounts[0].address;
    const key = `${process.env.VITE_FUEL_PROVIDER_URL}|${address}`;
    const newMarks = page.getByText('New', { exact: true });

    await test.step('First look at Home', async () => {
      await visit(page, '/wallet');
      await expect(page.getByRole('tab', { name: 'Assets' })).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate((k) => {
            const raw = localStorage.getItem('fuel_seenAssets');
            return raw ? Boolean((JSON.parse(raw) as SeenAssets)[k]) : false;
          }, key)
        )
        .toBe(true);
      await expect(newMarks).toHaveCount(0);
      await hold(page);
    });

    await test.step('Receive ETH and a second asset', () =>
      seedWallet(address, bn(100_000_000)));

    await test.step('Reopen Home: new assets marked', async () => {
      await reload(page);
      await expect(newMarks).toHaveCount(2, { timeout: 20_000 });
      await hold(page, 3500);
    });

    await test.step('Reopen again: nothing new', async () => {
      await reload(page);
      await expect(page.getByText('Ethereum').first()).toBeVisible();
      await expect(newMarks).toHaveCount(0);
      await hold(page);
    });
  });
});
