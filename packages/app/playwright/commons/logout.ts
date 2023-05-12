import type { Page } from '@playwright/test';

import { getButtonByText } from './button';
import { getByAriaLabel, getInputByName } from './locator';
import { hasText } from './text';

const logOutConfirmationPhrase = 'I have my recovery phrase';

export const logout = async (page: Page) => {
  await getByAriaLabel(page, 'Menu').click();
  await page.locator(`[data-key="settings"]`).click();
  await page.locator(`[data-key="logout"]`).click();
  await getInputByName(page, 'logoutConfirmation').type(
    logOutConfirmationPhrase
  );
  await getButtonByText(page, /Logout/).click();
  await hasText(page, 'Create a new Fuel Wallet');
};
