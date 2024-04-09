import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';
import { WALLET_PASSWORD, mockData } from '../mocks';

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

    // fills form data
    await getByAriaLabel(page, 'Current Password').fill(WALLET_PASSWORD);
    await getByAriaLabel(page, 'New Password').fill('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').fill('newPass12345$');

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
    await getByAriaLabel(page, 'Current Password').fill('wrongPass123$');
    await getByAriaLabel(page, 'New Password').fill('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').fill('newPass12345$');

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
    await getByAriaLabel(page, 'Current Password').fill('12345678');
    await getByAriaLabel(page, 'New Password').fill('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').fill('newPass123456$');
    await getByAriaLabel(page, 'Confirm Password').blur();

    await hasText(page, 'Passwords must match');
  });

  test('should not change the user current and new passwords are the same', async () => {
    // goes to the change password page
    await visit(page, '/settings/change-password');

    // ensure that the page has changed
    await hasText(page, /Change Password/i);

    // fills form data
    await getByAriaLabel(page, 'Current Password').fill('newPass12345$');
    await getByAriaLabel(page, 'New Password').fill('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').fill('newPass12345$');
    await getByAriaLabel(page, 'Confirm Password').blur();

    await hasText(
      page,
      'New password cannot be the same as the current password'
    );
  });
});
