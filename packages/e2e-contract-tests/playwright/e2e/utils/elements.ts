import type { Page } from '@playwright/test';

export async function checkAriaLabelsContainsText(
  walletNotificationPage: Page,
  ariaLabel: string,
  text: string
) {
  const locator = walletNotificationPage.locator(`[aria-label="${ariaLabel}"]`);
  const count = await locator.count();

  for (let i = 0; i < count; i++) {
    if (text === '') {
      expect(locator.nth(i).innerHTML()).not.toBe('');
    } else {
      expect((await locator.nth(i).innerHTML()).includes(text)).toBeTruthy();
    }
  }
}
