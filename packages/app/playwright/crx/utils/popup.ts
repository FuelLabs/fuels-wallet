import type { Page } from '@playwright/test';

import { getByAriaLabel, hasText, visit, waitAriaLabel } from '../../commons';
import type { MockData } from '../../mocks';

export async function getAccountByName(popupPage: Page, name: string) {
  const accounts = await getWalletAccounts(popupPage);
  return accounts.find((account) => account.name === name);
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

  // If account is already selected return it
  // to avoid unnecessary changes
  if (account.isCurrent) {
    return account;
  }

  await getByAriaLabel(popupPage, 'Accounts').click();
  // Add position to click on the element and not on copy button
  await getByAriaLabel(popupPage, name).click({
    position: {
      x: 10,
      y: 10,
    },
  });
  await waitAriaLabel(popupPage, name);

  // Return account to be used on tests
  account = await getAccountByName(popupPage, name);

  return account;
}

export async function hideAccount(popupPage: Page, name: string) {
  await getByAriaLabel(popupPage, 'Accounts').click();
  // Add position to click on the element and not on copy button
  await getByAriaLabel(popupPage, `Account Actions ${name}`).click();
  await getByAriaLabel(popupPage, `Hide ${name}`).click();
  await hasText(popupPage, 'Show hidden accounts');
  await popupPage.getByText(name).isHidden();

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
    console.log('Clipboard text:', text); // log the text to the console
    return text;
  } catch (error) {
    console.error('Failed to read clipboard contents:', error);
    return ''; // Return empty string or handle the error as needed
  }
}

export async function getAddressForAccountNumber(
  popupPage: Page,
  accountName: string,
  accountNumber: number
): Promise<string> {
  await getByAriaLabel(popupPage, 'Accounts').click();

  // Construct the XPath selector dynamically based on the order of the account in the list
  const xpathSelector = `/html/body/div[2]/div/div/div/div/article[${accountNumber}]/div[1]/div[2]/div/div/button`;

  // Click on the element
  await popupPage.click(`xpath=${xpathSelector}`);

  await getByAriaLabel(popupPage, accountName).click({
    position: {
      x: 10,
      y: 10,
    },
  });

  return getClipboardText(popupPage);
}

/* Not yet used and needs fixing */
export async function exportPrivateKey(
  popupPage: Page,
  data: MockData,
  walletPassword: string
): Promise<string> {
  await visit(popupPage, '/wallet');
  await hasText(popupPage, /Assets/i);
  await getByAriaLabel(popupPage, 'Accounts').click();
  await hasText(popupPage, data.accounts[0].name);
  await getByAriaLabel(
    popupPage,
    `Account Actions ${data.accounts[0].name}`
  ).click();
  await getByAriaLabel(popupPage, `Export ${data.accounts[0].name}`).click();
  await hasText(popupPage, 'Unlock your wallet to continue');
  await getByAriaLabel(popupPage, 'Your Password').fill(walletPassword);
  await getByAriaLabel(popupPage, 'Unlock wallet').click();
  await hasText(popupPage, /Export Private Key/i);
  await hasText(popupPage, data.accounts[0].privateKey);

  await popupPage.click('use[xlink\\:href="/icons/sprite.svg#Copy"]');
  // await expect(page).toHaveText('Copied to clipboard');  TODO FIX!

  console.log('12');
  return getClipboardText(popupPage);
}
