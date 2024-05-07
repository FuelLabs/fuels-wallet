import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  getElementByText,
  getInputByName,
  hasAriaLabel,
  hasText,
  reload,
  visit,
  waitUrl,
} from '../commons';

import {
  createAccount,
  createAccountFromPrivateKey,
  getAddressForAccountNumber,
} from '../crx/utils';

import type { MockData } from '../mocks';
import { WALLET_PASSWORD, mockData } from '../mocks';

test.describe('Account', () => {
  let browser: Browser;
  let page: Page;
  let data: MockData;
  let mnemonic: string;
  let tempMnemonic: string;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    data = await mockData(page, 2);
    tempMnemonic = data.mnemonic;
    console.log(`Temp mnemonic ${tempMnemonic}`);
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
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[0].name}`
    ).click();
    await getByAriaLabel(page, `Edit ${data.accounts[0].name}`).click();
    await hasText(page, /Edit/i);
    const inputName = getInputByName(page, 'name');
    await expect(inputName).toBeFocused();
    await inputName.fill('Test 1');
    const editBtn = getButtonByText(page, /edit/i);
    expect(editBtn).toBeEnabled();
    await editBtn.click();
    await hasText(page, /Test 1/i);
  });

  test('should be able to export private key', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[0].name}`
    ).click();
    await getByAriaLabel(page, `Export ${data.accounts[0].name}`).click();

    await hasText(page, 'Unlock your wallet to continue');
    await getByAriaLabel(page, 'Your Password').fill(WALLET_PASSWORD);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /Export Private Key/i);
    await hasText(page, data.accounts[0].privateKey);
  });

  test('should be able to hide/unhide account', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await hasText(page, data.accounts[1].name);
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[1].name}`
    ).click();
    await getByAriaLabel(page, `Hide ${data.accounts[1].name}`).click();
    await hasText(page, 'Show hidden accounts');
    await page.getByText(data.accounts[1].name).isHidden();
    await getByAriaLabel(page, 'Toggle hidden accounts').click();
    await hasText(page, data.accounts[1].name);
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[1].name}`
    ).click();
    await getByAriaLabel(page, `Unhide ${data.accounts[1].name}`).click();
    await page.getByText('Show hidden accounts').isHidden();
  });

  test('should not be able to hide primary account', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await hasText(page, data.accounts[1].name);
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[1].name}`
    ).click();
    await getByAriaLabel(page, `Hide ${data.accounts[1].name}`).click();
    await hasText(page, 'Show hidden accounts');
    await page.getByText(data.accounts[1].name).isHidden();
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[0].name}`
    ).click();
    await getByAriaLabel(page, `Hide ${data.accounts[0].name}`).isHidden();
  });

  test('should fail if inform incorrect password, but work after trying again with correct one', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await hasText(page, data.accounts[0].name);
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[0].name}`
    ).click();
    await getByAriaLabel(page, `Export ${data.accounts[0].name}`).click();

    await hasText(page, 'Unlock your wallet to continue');
    const passwordInput = getByAriaLabel(page, 'Your Password');
    await passwordInput.fill(`${WALLET_PASSWORD}1`);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /Invalid password/i);
    await passwordInput.clear();
    await passwordInput.fill(WALLET_PASSWORD);
    await getByAriaLabel(page, 'Unlock wallet').click();
    await hasText(page, /Export Private Key/i);
    await hasText(page, data.accounts[0].privateKey);
  });

  test('can add accounts using correct derivation path after importing from private key', async () => {
    // at this point 2 accounts have already been created
    // make sure we stored the seed phrase

    // WALLET 1
    // copy and save the address of accounts 1 and 2
    mnemonic = data.mnemonic;
    console.log(`Main mnemonic ${mnemonic}`);
    const wal1Account1: string = await getAddressForAccountNumber(
      page,
      'Account 1',
      1
    );
    const wal1Account2: string = await getAddressForAccountNumber(
      page,
      'Account 2',
      2
    );

    // create account 3
    await createAccount(page);
    const wal1Account3: string = await getAddressForAccountNumber(
      page,
      'Account 3',
      3
    );

    console.log(wal1Account1);
    console.log(wal1Account2);
    console.log(wal1Account3);

    await browser.close();

    // WALLET 2 - create new wallet
    browser = await chromium.launch();
    page = await browser.newPage();
    await visit(page, '/');
    const data2Wallet = await mockData(page, 1);
    await reload(page);

    // save the address
    const wal2Account1: string = await getAddressForAccountNumber(
      page,
      'Account 1',
      1
    );

    // get the private key from the created mock account (1st account)
    const privateKey = data2Wallet.accounts[0].privateKey;

    console.log(wal2Account1);

    await browser.close();

    //WALLET 3 - recover WALLET 1, should only show 1 account
    browser = await chromium.launch();
    page = await browser.newPage();

    await visit(page, '/wallet');
    await getElementByText(page, /Import seed phrase/i).click();

    /** Accept terms */
    await hasText(page, /Terms of use Agreement/i);
    const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
    await agreeCheckbox.click();
    await getButtonByText(page, /Next: Seed Phrase/i).click();

    /** Copy words to clipboard area */
    await page.evaluate(`navigator.clipboard.writeText('${mnemonic}')`);

    /** Simulating clipboard write */
    await getButtonByText(page, /Paste/i).click();

    /** Confirm Mnemonic */
    await hasText(page, /Recover wallet/i);
    await getButtonByText(page, /Paste/i).click();
    await getButtonByText(page, /Next/i).click();

    /** Adding password */
    await hasText(page, /Create password for encryption/i);
    const passwordInput = getByAriaLabel(page, 'Your Password');
    await passwordInput.fill(WALLET_PASSWORD);
    await passwordInput.press('Tab');
    const confirmPasswordInput = getByAriaLabel(page, 'Confirm Password');
    await confirmPasswordInput.fill(WALLET_PASSWORD);
    await confirmPasswordInput.press('Tab');
    await getButtonByText(page, /Next/i).click();

    /** Account created */
    await hasText(page, /Wallet created successfully/i);
    await hasText(page, /Account 1/i);
    await getButtonByText(page, /Go to wallet/i).click();

    // save the address
    const wal3Account1: string = await getAddressForAccountNumber(
      page,
      'Account 1',
      1
    );

    // add account 2
    await createAccount(page);
    const wal3Account2: string = await getAddressForAccountNumber(
      page,
      'Account 2',
      2
    );

    // import wallet 2 (one account) from private key
    await createAccountFromPrivateKey(page, privateKey, 'Account 3');
    const wal3Account3: string = await getAddressForAccountNumber(
      page,
      'Account 3',
      3
    );
    // add account 4
    await createAccount(page);
    const wal3Account4: string = await getAddressForAccountNumber(
      page,
      'Account 4',
      4
    );

    console.log(wal3Account1);
    console.log(wal3Account2);
    console.log(wal3Account3);
    console.log(wal3Account4);

    // Checks
    // saved wal 1 add account 1 = wal 3 add account 1
    expect(wal3Account1).toBe(wal1Account1);
    // saved wal 1 add account 2 = wal 3 add account 2
    expect(wal3Account2).toBe(wal1Account2);
    // saved wal 2 add account = wal 3 add account 3
    expect(wal3Account3).toBe(wal2Account1);
    // saved wal 1 add account 3 = wal 3 add account 4
    expect(wal3Account4).toBe(wal1Account3);
  });
});
