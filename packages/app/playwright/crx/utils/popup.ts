import type { Page } from '@playwright/test';

import { delay, getByAriaLabel, hasText, waitAriaLabel } from '../../commons';

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
  console.log(11);
  let account = await getAccountByName(popupPage, name);
  console.log(12);

  // If account is already selected return it
  // to avoid unnecessary changes
  if (account.isCurrent) {
    return account;
  }

  console.log(14);
  await waitAriaLabel(popupPage, 'Accounts');
  console.log(141);
  await getByAriaLabel(popupPage, 'Accounts').click();
  console.log(15);
  // Add position to click on the element and not on copy button
  await waitAriaLabel(popupPage, name);
  await getByAriaLabel(popupPage, name).click({
    position: {
      x: 10,
      y: 10,
    },
  });
  console.log(16);
  await waitAriaLabel(popupPage, name);

  console.log(17);
  // Return account to be used on tests
  account = await getAccountByName(popupPage, name);

  console.log(18);
  return account;
}

export async function hideAccount(popupPage: Page, name: string) {
  console.log(21);
  await getByAriaLabel(popupPage, 'Accounts').click();
  console.log(22);
  // Add position to click on the element and not on copy button
  await getByAriaLabel(popupPage, `Account Actions ${name}`).click();
  console.log(23);
  await getByAriaLabel(popupPage, `Hide ${name}`).click();
  console.log(24);
  await hasText(popupPage, 'Show hidden accounts');
  console.log(25);
  await popupPage.getByText(name).isHidden();

  console.log(26);
  await getByAriaLabel(popupPage, 'Close dialog').click();
  console.log(27);
}

export async function waitAccountPage(popupPage: Page, name: string) {
  await popupPage.waitForSelector(`[data-account-name="${name}"]`);
}

export async function waitWalletToLoad(popupPage: Page) {
  await popupPage.waitForSelector('[data-account-name]');
}
