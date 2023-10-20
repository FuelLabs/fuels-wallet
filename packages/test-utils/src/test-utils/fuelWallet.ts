import { type BrowserContext, type Page } from '@playwright/test';

import { expect } from '../fixtures';
import { FUEL_MNEMONIC, FUEL_WALLET_PASSWORD } from '../mocks';
import { shortAddress } from '../utils';

import { getButtonByText } from './button';
import { getByAriaLabel } from './locator';

// TODO: this function can only setup a wallet on http://localhost:4001
// because we cannot modify the existing testnet provider url
export async function walletSetup(
  context: BrowserContext,
  fuelExtensionId: string,
  page: Page,
  fuelProviderUrl: string,
  chainName: string,
) {
  await page.goto(`chrome-extension://${fuelExtensionId}/popup.html`);

  const signupPage = await context.waitForEvent('page', {
    predicate: (page) => page.url().includes('sign-up'),
  });
  expect(signupPage.url()).toContain('sign-up');

  const button = signupPage.locator('h3').getByText('Import seed phrase');
  await button.click();

  // Agree to T&S
  await signupPage.getByRole('checkbox').click();
  const toSeedPhrase = getButtonByText(signupPage, 'Next: Seed Phrase');
  await toSeedPhrase.click();

  // Copy and paste seed phrase
  /** Copy words to clipboard area */
  await signupPage.evaluate(
    `navigator.clipboard.writeText('${FUEL_MNEMONIC}')`,
  );
  const pasteButton = signupPage.locator('button').getByText('Paste');
  await pasteButton.click();
  const toPassword = signupPage
    .locator('button')
    .getByText('Next: Your password');
  await toPassword.click();

  // Enter password
  const enterPassword = signupPage.locator(`[aria-label="Your Password"]`);
  await enterPassword.type(FUEL_WALLET_PASSWORD);
  // Confirm password
  const confirmPassword = signupPage.locator(`[aria-label="Confirm Password"]`);
  await confirmPassword.type(FUEL_WALLET_PASSWORD);
  const toFinish = getButtonByText(signupPage, 'Next: Finish set-up');
  await toFinish.click();

  await signupPage
    .locator('h2')
    .getByText('Wallet created successfully')
    .waitFor({ state: 'visible', timeout: 9000 });

  await signupPage.goto(
    `chrome-extension://${fuelExtensionId}/popup.html#/wallet`,
  );

  // Add testnet url
  const selectNetworkButton = signupPage.getByLabel('Selected Network');
  await selectNetworkButton.click();

  if ((await signupPage.getByText(chainName).count()) === 0) {
    const addNetworkButton = signupPage.getByLabel('Add network');
    await addNetworkButton.click();

    const urlInput = signupPage.getByLabel('Network URL');
    await urlInput.fill(fuelProviderUrl);

    const addNewNetworkButton = signupPage.getByLabel('Add new network');
    await addNewNetworkButton.click();
  } else {
    const closeNetworkButton = getByAriaLabel(signupPage, 'Close dialog');
    await closeNetworkButton.click();
  }
}

export async function walletConnect(context: BrowserContext) {
  const walletPage = await getWalletPage(context);

  const nextButton = getButtonByText(walletPage, 'Next');
  await nextButton.click();
  const connectButton = getButtonByText(walletPage, 'Connect');
  await connectButton.click();
}

export async function walletApprove(context: BrowserContext) {
  const walletPage = await getWalletPage(context);

  const approveButton = walletPage.locator('button').getByText('Approve');
  await approveButton.click();
}

export async function addAssetThroughSettings(
  context: BrowserContext,
  assetId: string,
  name: string,
  symbol: string,
  decimals: number,
  imageUrl?: string,
) {
  const walletPage = context.pages().find((page) => {
    const url = page.url();
    return url.includes('/popup.html#/wallet');
  });

  if (!walletPage) {
    throw new Error('Wallet Page could not be found');
  }

  const menuButton = getByAriaLabel(walletPage, 'Menu', true);
  await menuButton.click();

  const settingsButton = walletPage.getByRole('menuitem').getByText('Settings');
  await settingsButton.click();

  const assetsButton = walletPage.getByRole('menuitem').getByText('Assets');
  await assetsButton.click();

  const addAssetButton = getByAriaLabel(walletPage, 'Add Asset');
  await addAssetButton.click();

  const assetIdInput = getByAriaLabel(walletPage, 'Asset ID');
  await assetIdInput.fill(assetId);

  const assetNameInput = walletPage.getByLabel('Asset name');
  await assetNameInput.fill(name);
  const assetSymbolInput = walletPage.getByLabel('Asset symbol');
  await assetSymbolInput.fill(symbol);
  const assetDecimalsInput = walletPage.getByLabel('Asset decimals');
  await assetDecimalsInput.fill(decimals.toString());
  const assetImageUrlInput = walletPage.getByLabel('Asset image Url');
  await assetImageUrlInput.fill(imageUrl || '');

  const saveButton = getButtonByText(walletPage, 'Save');
  await saveButton.click();
}

export async function addAssetFromHomeBalance(
  context: BrowserContext,
  assetId: string,
  name: string,
  symbol: string,
  decimals: number,
  imageUrl?: string,
) {
  const walletPage = context.pages().find((page) => {
    const url = page.url();
    return url.includes('/popup.html#/wallet');
  });

  if (!walletPage) {
    throw new Error('Wallet Page could not be found');
  }

  const showUnkownAssetsButton = getButtonByText(
    walletPage,
    'Show unknown assets',
  );
  await showUnkownAssetsButton.click();

  await walletPage
    .getByRole('article')
    .filter({ hasText: shortAddress(assetId) })
    .locator('button')
    .getByText('(Add)')
    .click();

  const assetNameInput = walletPage.getByLabel('Asset name');
  await assetNameInput.fill(name);
  const assetSymbolInput = walletPage.getByLabel('Asset symbol');
  await assetSymbolInput.fill(symbol);
  const assetDecimalsInput = walletPage.getByLabel('Asset decimals');
  await assetDecimalsInput.fill(decimals.toString());
  const assetImageUrlInput = walletPage.getByLabel('Asset image Url');
  await assetImageUrlInput.fill(imageUrl || '');

  const saveButton = getButtonByText(walletPage, 'Save');
  await saveButton.click();
}

export async function getWalletPage(context: BrowserContext) {
  let walletPage = context.pages().find((page) => {
    const url = page.url();
    return url.includes('/popup.html?');
  });
  if (!walletPage) {
    walletPage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('/popup'),
    });
  }
  return walletPage;
}
