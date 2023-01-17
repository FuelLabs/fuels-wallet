import type { Browser, Page } from '@playwright/test';
import test, { chromium } from '@playwright/test';

import { getButtonByText, getByAriaLabel, hasText, visit } from '../commons';
import { mockData } from '../mocks';

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
    await getByAriaLabel(page, 'Current Password').type('12345678');
    await getByAriaLabel(page, 'New Password').type('newPass12345');
    await getByAriaLabel(page, 'Confirm Password').type('newPass12345');

    // submit data
    await getButtonByText(page, 'Save').click();
    await hasText(page, /assets/i, 1);
  });

  test('should not change the user password when passwords not the same', async () => {
    // goes to the change password page
    await visit(page, '/settings/change-password');

    // ensure that the page has changed
    await hasText(page, /Change Password/i);

    // fills form data
    await getByAriaLabel(page, 'Current Password').type('12345678');
    await getByAriaLabel(page, 'New Password').type('newPass12345');
    await getByAriaLabel(page, 'Confirm Password').type('newPass12344');

    // submit data
    await getButtonByText(page, 'Save').click();
    await hasText(page, 'Passwords must match');
  });
});
