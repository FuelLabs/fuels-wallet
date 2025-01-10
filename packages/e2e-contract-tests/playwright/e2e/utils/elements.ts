import { type Page, expect } from '@playwright/test';

export async function checkAriaLabelsContainsText(
  walletNotificationPage: Page,
  ariaLabel: string,
  text: string
) {
  console.log(`🔍 Checking aria-label: ${ariaLabel}`);
  const locator = walletNotificationPage.locator(`[aria-label="${ariaLabel}"]`);
  console.log(`🔍 Locator: ${locator}`);
  const count = await locator.count();
  console.log(`🔍 Count: ${count}`);

  for (let i = 0; i < count; i++) {
    console.log(`🔍 Inner HTML: ${await locator.nth(i).innerHTML()}`);
    if (text === '') {
      console.log('🔍 Text is empty');
      expect(locator.nth(i).innerHTML()).not.toBe('');
    } else {
      console.log(`🔍 Text: ${text}`);
      expect((await locator.nth(i).innerHTML()).includes(text)).toBeTruthy();
    }
  }
}
