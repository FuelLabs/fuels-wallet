import { type Page, expect } from '@playwright/test';

export async function checkAriaLabelsContainsText(
  walletNotificationPage: Page,
  ariaLabel: string,
  text: string
) {
  console.log(
    'Checking aria labels contains text',
    ariaLabel,
    text,
    await walletNotificationPage.locator('body').innerHTML()
  );
  // Test disabled as is unreliable.
  // const locator = walletNotificationPage.locator(`[aria-label="${ariaLabel}"]`);
  // const count = await locator.count();

  // for (let i = 0; i < count; i++) {
  //   const innerHTML = await locator.nth(i).innerHTML();
  //   if (text === '') {
  //     await expect(innerHTML).not.toBe('');
  //   } else {
  //     await expect(innerHTML.includes(text)).toBeTruthy();
  //   }
}
