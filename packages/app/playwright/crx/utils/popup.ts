import type { Page } from '@playwright/test';

import { expect } from '@fuels/playwright-utils';
import { getByAriaLabel, hasText, visit, waitAriaLabel } from '../../commons';
import type { MockData } from '../../mocks';

export async function getAccountByName(popupPage: Page, name: string) {
  const accounts = await getWalletAccounts(popupPage);
  
  // Added check to throw an error if account is not found
  const account = accounts.find((account) => account.name === name);
  if (!account) {
    throw new Error(`Account with name "${name}" not found`);
  }

  return account;
}

export async function getWalletAccounts(popupPage: Page) {
  const accounts = await popupPage.evaluate(async () => {
    const fuelDB = window.fuelDB;
    return fuelDB.accounts.toArray();
  });
  return accounts;
}

export async function switchAccount(popupPage: Page, name: string) {
  let account = await getAccountByName(popupPage, name);

  if (account.isCurrent) {
    return account;
  }

  await popupPage.waitForTimeout(2000);
  await getByAriaLabel(popupPage, 'Accounts').click();

  await hasText(popupPage, name);
  await popupPage.waitForTimeout(5000);
  await getByAriaLabel(popupPage, name).click();

  await expect
    .poll(
      () =>
        waitAriaLabel(popupPage, `${name} selected`)
          .then(() => true)
          .catch(() => false),
      { timeout: 30000 }
    )
    .toBeTruthy();

  account = await getAccountByName(popupPage, name);

  return account;
}

export async function hideAccount(popupPage: Page, name: string) {
  await getByAriaLabel(popupPage, 'Accounts').click();
  await getByAriaLabel(popupPage, `Account Actions ${name}`).click();
  await getByAriaLabel(popupPage, `Hide ${name}`).click();
  await hasText(popupPage, 'Show hidden accounts');
  await popupPage.locator(`text=${name}`).isHidden();

  await getByAriaLabel(popupPage, 'Close dialog').click();
}

export async function waitAccountPage(popupPage: Page, name: string) {
  await popupPage.waitForSelector(`[data-account-name="${name}"]`);
}

export async function waitWalletToLoad(popupPage: Page) {
  await popupPage.waitForSelector('[data-account-name]');
}

export async function createAccount(popupPage: Page) {
  await waitWalletToLoad(popupPage);
  const accounts = await getWalletAccounts(popupPage);
  await getByAriaLabel(popupPage, 'Accounts').click();
  await getByAriaLabel(popupPage, 'Add account').click();
  await waitAccountPage(popupPage, `Account ${accounts.length + 1}`);
}

export async function createAccountFromPrivateKey(
  popupPage: Page,
  privateKey: string,
  name: string
) {
  await waitWalletToLoad(popupPage);
  await getByAriaLabel(popupPage, 'Accounts').click();
  await getByAriaLabel(popupPage, 'Import from private key').click();
  await getByAriaLabel(popupPage, 'Private Key').fill(privateKey);
  if (name) {
    await getByAriaLabel(popupPage, 'Account Name').clear();
    await getByAriaLabel(popupPage, 'Account Name').fill(name);
  }
  await getByAriaLabel(popupPage, 'Import').click();
  await waitAccountPage(popupPage, name);
}

export async function getClipboardText(popupPage: Page): Promise<string> {
  try {
    const text = await popupPage.evaluate(() => navigator.clipboard.readText());
    console.log('Clipboard text:', text);
    return text;
  } catch (error) {
    console.error('Failed to read clipboard contents:', error);
    return '';
  }
}

export async function getAddressForAccountNumber(
  popupPage: Page,
  accountName: string,
  accountNumber: number
): Promise<string> {
  await getByAriaLabel(popupPage, 'Accounts').click();

  const xpathSelector = `/html/body/div[2]/div/div/div/div/article[${accountNumber}]/div[1]/div[2]/div/div/button`;
  await popupPage.click(`xpath=${xpathSelector}`);

  await getByAriaLabel(popupPage, accountName).click({
    position: {
      x: 10,
      y: 10,
    },
  });

  return getClipboardText(popupPage);
}
