import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';
import { mockData, WALLET_PASSWORD } from '../mocks';

test.describe('ChangePassword', () => {
  let browser: Browser;
  let page: Page;

  test.beforeEach(async () => {
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

    // fills form data
    await getByAriaLabel(page, 'Current Password').type(WALLET_PASSWORD);
    await getByAriaLabel(page, 'New Password').type('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').type('newPass12345$');

    // submit data
    await hasText(page, 'Save');
    await getButtonByText(page, 'Save').click();
    await hasText(page, 'Password Changed', 0, 30000);
  });

  test('should not change the user password when current password is wrong', async () => {
    // goes to the change password page
    await visit(page, '/settings/change-password');

    // ensure that the page has changed
    await hasText(page, /Change Password/i);

    // fills form data
    await getByAriaLabel(page, 'Current Password').type('wrongPass123$');
    await getByAriaLabel(page, 'New Password').type('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').type('newPass12345$');

    // submit data
    await hasText(page, 'Save');
    await getButtonByText(page, 'Save').click();
    await hasText(page, 'Incorrect password', 0, 30000);
  });

  test('should not change the user password when passwords not the same', async () => {
    // goes to the change password page
    await visit(page, '/settings/change-password');

    // ensure that the page has changed
    await hasText(page, /Change Password/i);

    // fills form data
    await getByAriaLabel(page, 'Current Password').type('12345678');
    await getByAriaLabel(page, 'New Password').type('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').type('newPass123456$');
    await getByAriaLabel(page, 'Confirm Password').blur();

    await hasText(page, 'Passwords must match');
  });
});
