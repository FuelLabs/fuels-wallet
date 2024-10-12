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

import { Address } from 'fuels';
import type { MockData } from '../mocks';
import { WALLET_PASSWORD, mockData } from '../mocks';

test.describe('New Accounts', () => {
  let browser: Browser;
  let page: Page;
  let data: MockData;
  let mnemonic: string | undefined;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    data = await mockData(page, 2, undefined, mnemonic);
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
    await hasAriaLabel(page, Address.fromDynamicInput(address).toString());
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
});

test.describe('Existing Accounts', () => {
  let browser: Browser;
  let page: Page;
  let _data: MockData;
  const mnemonic =
    'laundry feature kiss addict increase wolf monkey abstract hammer remove mass matter';

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    _data = await mockData(page, 2, undefined, mnemonic);
    await reload(page);
  });

  test('can add accounts using correct derivation path after importing from private key', async () => {
    // at this point 2 accounts have already been created
    const fuelAddress1 =
      'fuel1kfnz04g7k8wjw22s03s3kk46wxr63he3v5v6kyrv76m7wzh7x9jqvqffua';
    const fuelAddress2 =
      'fuel1kyxzyv5z39fuxnr6k9ncxujxn4y07fu6pf73vslmemgpex325vrsytpqks';
    const fuelAddress3 =
      'fuel152720qgc5wthxu4g7a2g6s7xy9d8wjgtffl489k706xyd2fas0wqyv0vsw';
    const fuelPrivKey =
      '0x7f802a2a277872af1204140bd2c77c2193309c366e3c71ff1c4c31cea0a53f38';
    const fuelAddPriv =
      'fuel1szu0uagadwpgl0fuz2thrtzn7artghvhexg5d9at4t76nzeesqasrdmjxy';

    // import account from private key
    await createAccountFromPrivateKey(page, fuelPrivKey, 'Account 3');

    // Create the 4th account
    await createAccount(page);

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

    const wal1Account3: string = await getAddressForAccountNumber(
      page,
      'Account 3',
      3
    );

    const wal1Account4: string = await getAddressForAccountNumber(
      page,
      'Account 4',
      4
    );

    // Checks
    // saved wal 1 add account 1 = wal 3 add account 1
    expect(wal1Account1).toBe(
      Address.fromDynamicInput(fuelAddress1).toString()
    );
    // saved wal 1 add account 2 = wal 3 add account 2
    expect(wal1Account2).toBe(
      Address.fromDynamicInput(fuelAddress2).toString()
    );
    // saved wal 2 add account = wal 3 add account 3
    expect(wal1Account3).toBe(Address.fromDynamicInput(fuelAddPriv).toString());
    // saved wal 1 add account 3 = wal 3 add account 4
    expect(wal1Account4).toBe(
      Address.fromDynamicInput(fuelAddress3).toString()
    );
  });
});
