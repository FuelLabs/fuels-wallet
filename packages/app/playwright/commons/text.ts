import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function hasText(page: Page, text: string | RegExp) {
  const textFound = await page.getByText(text);
  await expect(textFound).toBeTruthy();
  return textFound;
}
