import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export function getByAriaLabel(page: Page, selector: string) {
  return page.locator(`[aria-label="${selector}"]`);
}

export async function waitAriaLabel(page: Page, selector: string) {
  const locator = page.locator(`[aria-label="${selector}"]`);
  await expect(locator).toBeVisible();
  return locator;
}

export function getInputByName(page: Page, name: string) {
  return page.locator(`input[name="${name}"]`);
}
