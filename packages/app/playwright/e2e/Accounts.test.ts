import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  getInputByName,
  hasAriaLabel,
  hasText,
  reload,
  visit,
  waitUrl,
} from '../commons';
import type { MockData } from '../mocks';
import { mockData, WALLET_PASSWORD } from '../mocks';

test.describe('Account', () => {
  let browser: Browser;
  let page: Page;
  let data: MockData;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    data = await mockData(page, 2);
    await reload(page);
  });

  test('should be able to switch between accounts', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await hasText(page, data.accounts[1].name);
    await getByAriaLabel(page, data.accounts[1].name).click({
      position: {
        x: 10,
        y: 10,
      },
    });
    await waitUrl(page, '/wallet');
    await hasText(page, /Assets/i);
    const address = data.accounts[1].address.toString();
    await hasAriaLabel(page, address);
  });

  test('should be able to edit account name', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await getByAriaLabel(page, 'Update').first().click();
    await hasText(page, /Edit/i);
    const inputName = await getInputByName(page, 'name');
    await expect(inputName).toBeFocused();
    await inputName.fill('Test 1');
    const editBtn = await getButtonByText(page, /edit/i);
    expect(editBtn).toBeEnabled();
    await editBtn.click();
    await hasText(page, /Test 1/i);
  });

  test('should be able to export private key', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await getByAriaLabel(page, `Export ${data.accounts[0].name}`)
      .first()
      .click();

    await hasText(page, 'Unlock your wallet to continue');
    await getByAriaLabel(page, 'Your Password').type(WALLET_PASSWORD);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /Export Private Key/i);
    await hasText(page, data.accounts[0].privateKey);
  });

  test('should fail if inform incorrect password, but work after trying again with correct one', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await getByAriaLabel(page, `Export ${data.accounts[0].name}`)
      .first()
      .click();

    await hasText(page, 'Unlock your wallet to continue');
    await getByAriaLabel(page, 'Your Password').type(`${WALLET_PASSWORD}1`);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /Export Private Key/i);
    await hasText(page, 'Failed to export. Invalid Credentials.');
    await getByAriaLabel(page, 'Retry Unlock').click();
    await getByAriaLabel(page, 'Your Password').type(WALLET_PASSWORD);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /Export Private Key/i);
    await hasText(page, data.accounts[0].privateKey);
  });
});
