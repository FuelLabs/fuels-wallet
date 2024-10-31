import type { Locator, Page } from '@playwright/test';
import { expect } from '../fixtures';

export function getButtonByText(
  page: Page,
  selector: string | RegExp,
  exact = false
) {
  return page.locator('button').getByText(selector, { exact });
}

export function expectButtonToBeEnabled(
  button: Locator,
  locatorOptions: {
    message?: string;
    timeout?: number;
    intervals?: number[];
  } = {}
) {
  const { message, timeout, intervals } = locatorOptions;
  return expect
    .poll(async () => await button.isEnabled(), {
      timeout: timeout ?? 7000,
      intervals: intervals ?? [1000, 2000, 3000, 4000, 5000, 6000, 7000],
      message: message ?? 'Button is not enabled',
    })
    .toBeTruthy();
}
