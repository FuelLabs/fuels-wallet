import type { Page } from '@playwright/test';

import { getButtonByText } from './button';
import { getByAriaLabel } from './locator';
import { hasText } from './text';

export const logout = async (page: Page) => {
  await getByAriaLabel(page, 'Menu').click();
  await page.locator(`[data-key="settings"]`).click();
  await page.locator(`[data-key="logout"]`).click();
  await getButtonByText(page, /Logout/).click();
  await hasText(page, "Set up your Fuel Wallet");
};
