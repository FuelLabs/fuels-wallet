import { expect, test } from '@playwright/test';

import { visit } from '../commons';
import { mockData } from '../mocks';
import { hold } from './helpers';

test.describe('Connections moments', () => {
  test('removing the last connected app ends on a finished state', async ({
    page,
  }) => {
    await test.step('Open Connected apps', async () => {
      // mockData seeds one connection (createConnections).
      await mockData(page);
      await visit(page, '/settings/connected-apps');
      await expect(page.getByText('mock connection')).toBeVisible();
      await hold(page);
    });

    await test.step('Delete the connection', async () => {
      await page.getByLabel('Delete').click();
      await page.getByLabel('Confirm delete').click();
    });

    await test.step('All apps disconnected', async () => {
      const title = page.getByText('All apps disconnected');
      await expect(title).toBeVisible();
      await expect(
        page.getByText('No app can see your accounts now')
      ).toBeVisible();
      await expect(
        page.locator('.fuel-ticks').filter({ has: title })
      ).toHaveCount(1);
      await expect(
        page.getByText('Connection removed successfully')
      ).toHaveCount(0);
      await hold(page, 2500);
    });
  });
});
