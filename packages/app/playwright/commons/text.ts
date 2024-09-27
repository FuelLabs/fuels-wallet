import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function hasText(
  page: Page,
  text: string | RegExp,
  position = 0,
  timeout = 5000
) {
  const textFound = page.getByText(text).nth(position);
  await expect(textFound).toHaveText(text, {
    useInnerText: true,
    timeout,
  });
  return textFound;
}

export async function hasNoText(
  page: Page,
  text: string | RegExp,
  position = 0
) {
  return await expect(page.getByText(text).nth(position)).rejects.toThrow();
}

export async function hasAriaLabel(page: Page, value: string) {
  const selector = await page.waitForSelector(`[aria-label="${value}"]`);
  expect(await selector.getAttribute('aria-label')).toBe(value);
}
