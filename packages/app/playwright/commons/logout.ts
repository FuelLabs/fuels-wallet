import type { Page } from '@playwright/test';

import { expect } from '@fuels/playwright-utils';
import { getButtonByText } from './button';
import { getByAriaLabel } from './locator';
import { hasText } from './text';

export const logout = async (page: Page) => {
  await expect
    .poll(async () => () => getByAriaLabel(page, 'Menu'), { timeout: 1000 })
    .not.toThrow();
  await getByAriaLabel(page, 'Menu').click();
  await page.locator(`[data-key="settings"]`).click();
  await page.locator(`[data-key="logout"]`).click();
  await getButtonByText(page, /Logout/).click();
  await hasText(page, "Let's set up your Fuel Wallet");
};
