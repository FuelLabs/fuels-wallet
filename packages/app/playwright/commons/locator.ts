import type { Page } from '@playwright/test';

export function getByAriaLabel(page: Page, selector: string) {
  return page.locator(`[aria-label="${selector}"]`);
}

export function getInputByName(page: Page, name: string) {
  return page.locator(`input[name="${name}"]`);
}
