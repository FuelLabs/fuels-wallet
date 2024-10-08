import type { Page } from '@playwright/test';

export function getButtonByText(
  page: Page,
  selector: string | RegExp,
  exact = false
) {
  return page.locator('button').getByText(selector, { exact });
}
