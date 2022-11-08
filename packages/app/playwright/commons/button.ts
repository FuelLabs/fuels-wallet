import type { Page } from '@playwright/test';

export function getButtonByText(page: Page, selector: string | RegExp) {
  return page.locator('button').getByText(selector);
}
