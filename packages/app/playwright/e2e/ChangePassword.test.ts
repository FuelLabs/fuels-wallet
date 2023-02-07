import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  hasAriaLabel,
  hasText,
  visit,
} from '../commons';
import { mockData, WALLET_PASSWORD } from '../mocks';

test.describe('ChangePassword', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await visit(page, '/');
    await mockData(page);
  });

  test('should change the user password', async () => {
    // goes to the change password page
    await visit(page, '/settings/change-password');

    // ensure that the page has changed
    await hasText(page, /Change Password/i);
    await hasAriaLabel(page, 'New Password');
    await hasAriaLabel(page, 'Confirm Password');

    // fills form data
    await getByAriaLabel(page, 'Current Password').type(WALLET_PASSWORD);
    const newPasswordInput = await getByAriaLabel(page, 'New Password');
    await newPasswordInput.click();
    await newPasswordInput.type('newPass12345$');
    await newPasswordInput.blur();
    await newPasswordInput.click();

    const confirmPasswordInput = await getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.click({ position: { x: 240, y: 10 } });
    await confirmPasswordInput.type('newPass12345$');
    await confirmPasswordInput.blur();

    // submit data
    await hasText(page, 'Save');
    await getButtonByText(page, 'Save').click();
    await hasText(page, 'Password Changed', 0, 30000);
  });

  test('should not change the user password when passwords not the same', async () => {
    // goes to the change password page
    await visit(page, '/settings/change-password');

    // ensure that the page has changed
    await hasText(page, /Change Password/i);

    // fills form data
    await getByAriaLabel(page, 'Current Password').type('12345678');
    const newPasswordInput = await getByAriaLabel(page, 'New Password');
    await newPasswordInput.click();
    await newPasswordInput.type('newPass12345$');
    await newPasswordInput.blur();
    await newPasswordInput.click();

    const confirmPasswordInput = await getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.click({ position: { x: 240, y: 10 } });
    await confirmPasswordInput.type('newPass12344$');
    await confirmPasswordInput.blur();

    await hasText(page, 'Passwords must match');
  });
});
