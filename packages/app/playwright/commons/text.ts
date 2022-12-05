import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function hasText(page: Page, text: string | RegExp) {
  const textFound = page.getByText(text).first();
  await expect(textFound).toHaveText(text, {
    useInnerText: true,
  });
  return textFound;
}
