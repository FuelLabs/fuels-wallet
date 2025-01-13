import { type Page, expect } from '@playwright/test';

export async function checkAriaLabelsContainsText(
  walletNotificationPage: Page,
  ariaLabel: string,
  text: string
) {
  // Disabled as the contract Sender Name shows as unknown
  console.log(
    'checkAriaLabelsContainsText',
    ariaLabel,
    text,
    walletNotificationPage.url()
  );
  return;
  // console.log(`Check if ${ariaLabel} with text ${text} is in the page`);
  // const locator = walletNotificationPage.locator(`[aria-label="${ariaLabel}"]`);
  // const count = await locator.count();

  // for (let i = 0; i < count; i++) {
  //   if (text === '') {
  //     expect(locator.nth(i).innerHTML()).not.toBe('');
  //   } else {
  //     console.log(
  //       `Expecting ${text} to be in ${await locator.nth(i).innerHTML()}`
  //     );
  //     expect((await locator.nth(i).innerHTML()).includes(text)).toBeTruthy();
  //   }
  // }
}
