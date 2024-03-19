import type { Page } from '@playwright/test';

import { getByAriaLabel, hasText, waitAriaLabel } from '../../commons';

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
