import type { Page } from '@playwright/test';

export function getByAriaLabel(
  page: Page,
  selector: string,
  exact: boolean = false
) {
  return page.getByLabel(selector, { exact });
}

export async function waitAriaLabel(page: Page, selector: string) {
  return page.waitForSelector(`[aria-label="${selector}"]`);
}

export function getInputByName(page: Page, name: string) {
  return page.locator(`input[name="${name}"]`);
}
