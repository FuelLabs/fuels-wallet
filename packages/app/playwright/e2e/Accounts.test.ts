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
import { PRIVATE_KEY, WALLET_PASSWORD, mockData } from '../mocks';

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

  test('should not be able to import public address as a private key', async () => {
    await getByAriaLabel(page, 'Accounts').click();
    await getByAriaLabel(page, 'Import from private key').click();
    await getByAriaLabel(page, 'Private Key').fill(PRIVATE_KEY);
    await expect
      .poll(
        async () => {
          return await getElementByText(
            page,
            'This is a public key, please insert a private key instead.'
          ).isVisible();
        },
        { timeout: 10000 }
      )
      .toBeFalsy();
    await getByAriaLabel(page, 'Private Key').fill(
      '0xC425c5D0d1685Dd52BFD10A4e5C7612ea50794Cb2e675c4aa94F1E1291712ef5'
    );
    await expect
      .poll(
        async () => {
          return await getElementByText(
            page,
            'This is a public key, please insert a private key instead.'
          ).isVisible();
        },
        { timeout: 10000 }
      )
      .toBeTruthy();
  });

  test('should be able to switch between accounts', async () => {
    await visit(page, '/wallet');
    await hasText(page, /Assets/i);
    await getByAriaLabel(page, 'Accounts').click();
    await expect(
      page.getByRole('heading', { name: data.accounts[0].name, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: data.accounts[1].name,
        exact: true,
      })
    ).toBeVisible();
    await page
      .getByRole('heading', {
        name: data.accounts[1].name,
        exact: true,
      })
      .click({
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
    await expect(
      page.getByRole('heading', {
        name: data.accounts[0].name,
        exact: true,
      })
    ).toBeVisible();
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
    await expect(
      page.getByRole('heading', {
        name: data.accounts[0].name,
        exact: true,
      })
    ).toBeVisible();
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
    await expect(
      page.getByRole('heading', {
        name: data.accounts[0].name,
        exact: true,
      })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: data.accounts[1].name,
        exact: true,
      })
    ).toBeVisible();
    await getByAriaLabel(
      page,
      `Account Actions ${data.accounts[1].name}`
    ).click();
    await getByAriaLabel(page, `Hide ${data.accounts[1].name}`).click();
    await hasText(page, 'Show hidden accounts');
    await page.getByText(data.accounts[1].name).isHidden();
    await getByAriaLabel(page, 'Toggle hidden accounts').click();
    await expect(
      page.getByRole('heading', {
        name: data.accounts[1].name,
        exact: true,
      })
    ).toBeVisible();
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
    await expect(
      page.getByRole('heading', {
        name: data.accounts[0].name,
        exact: true,
      })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: data.accounts[1].name,
        exact: true,
      })
    ).toBeVisible();
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
    await expect(
      page.getByRole('heading', {
        name: data.accounts[0].name,
        exact: true,
      })
    ).toBeVisible();
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
      '0xb26627d51eb1dd2729507c611b5aba7187a8df316519ab106cf6b7e70afe3164';
    const fuelAddress2 =
      '0xb10c2232828953c34c7ab1678372469d48ff279a0a7d1643fbced01c9a2aa307';
    const fuelAddress3 =
      '0xa2bca78118a3977372a8f7548d43c6215a77490b4a7f5396de7e8c46a93d83dc';
    const fuelPrivKey =
      '0x7f802a2a277872af1204140bd2c77c2193309c366e3c71ff1c4c31cea0a53f38';
    const fuelAddPriv =
      '0x80b8fe751d6b828fbd3c129771ac53f746b45d97c9914697abaafda98b39803b';

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
