import { type BrowserContext } from '@playwright/test';

import { expect } from '../fixtures';
import { FUEL_MNEMONIC, FUEL_WALLET_PASSWORD } from '../mocks';
import { shortAddress } from '../utils';

import { getButtonByText } from './button';
import { getByAriaLabel } from './locator';

export class FuelWalletTestHelper {
  context;

  private constructor(context: BrowserContext) {
    this.context = context;
  }

  static async walletSetup(
    context: BrowserContext,
    fuelExtensionId: string,
    fuelProviderUrl: string,
    chainName: string,
    mnemonic: string = FUEL_MNEMONIC,
    password: string = FUEL_WALLET_PASSWORD
  ) {
    let signupPage = await context.newPage();
    await signupPage.goto(`chrome-extension://${fuelExtensionId}/popup.html`);
    signupPage = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('sign-up'),
    });
    expect(signupPage.url()).toContain('sign-up');

    const importSeedPhraseButton = signupPage
      .locator('h3')
      .getByText('Import seed phrase');
    await importSeedPhraseButton.click();

    await signupPage.getByRole('checkbox').click();
    const toSeedPhrase = getButtonByText(signupPage, 'Next: Seed Phrase');
    await toSeedPhrase.click();

    await signupPage.evaluate(`navigator.clipboard.writeText('${mnemonic}')`);
    const pasteButton = signupPage.locator('button').getByText('Paste');
    await pasteButton.click();
    const toPassword = signupPage
      .locator('button')
      .getByText('Next: Your password');
    await toPassword.click();

    const enterPassword = getByAriaLabel(signupPage, 'Your Password');
    await enterPassword.fill(password);
    const confirmPassword = getByAriaLabel(signupPage, 'Confirm Password');
    await confirmPassword.fill(password);
    const toFinish = getButtonByText(signupPage, 'Next: Finish set-up');
    await toFinish.click();

    await signupPage
      .locator('h2')
      .getByText('Wallet created successfully')
      .waitFor({ state: 'visible', timeout: 9000 });

    await signupPage.goto(
      `chrome-extension://${fuelExtensionId}/popup.html#/wallet`
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

    return new FuelWalletTestHelper(context);
  }

  async walletConnect(
    accountNames?: string[],
    connectCurrentAccount: boolean = true
  ) {
    const walletNotificationPage = await this.getWalletNotificationPage();

    if (!connectCurrentAccount) {
      const disconnectCurrentAccountButton = walletNotificationPage.getByRole(
        'switch',
        { checked: true }
      );
      await disconnectCurrentAccountButton.click();
    }

    if (accountNames) {
      for (const accountName of accountNames) {
        const accountConnectionButton = getByAriaLabel(
          walletNotificationPage,
          `Toggle ${accountName}`
        );
        await accountConnectionButton.click();
      }
    }

    const nextButton = getButtonByText(walletNotificationPage, 'Next');
    await nextButton.click();
    const connectButton = getButtonByText(walletNotificationPage, 'Connect');
    await connectButton.click();
  }

  async walletApprove() {
    const walletPage = await this.getWalletNotificationPage();

    const approveButton = getButtonByText(walletPage, 'Approve');
    await approveButton.click();
  }

  async getWalletNotificationPage() {
    let walletNotificationPage = this.context.pages().find((page) => {
      const url = page.url();
      return url.includes('/popup.html?');
    });

    if (!walletNotificationPage) {
      walletNotificationPage = await this.context.waitForEvent('page', {
        predicate: (page) => page.url().includes('/popup'),
      });
    }

    return walletNotificationPage;
  }

  async addAssetThroughSettings(
    assetId: string,
    name: string,
    symbol: string,
    decimals: number,
    imageUrl?: string
  ) {
    const walletPage = this.getWalletPage();

    const menuButton = getByAriaLabel(walletPage, 'Menu', true);
    await menuButton.click();

    const settingsButton = walletPage
      .getByRole('menuitem')
      .getByText('Settings');
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

  async addAssetFromHomeBalance(
    assetId: string,
    name: string,
    symbol: string,
    decimals: number,
    imageUrl?: string
  ) {
    const walletPage = this.getWalletPage();

    const showUnkownAssetsButton = getButtonByText(
      walletPage,
      'Show unknown assets'
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

  async addAccount() {
    const walletPage = this.getWalletPage();

    const accountsButton = getByAriaLabel(walletPage, 'Accounts');
    await accountsButton.click();
    const addAccountButton = getByAriaLabel(walletPage, 'Add account');
    await addAccountButton.click();
  }

  async switchAccount(accountName: string) {
    const walletPage = this.getWalletPage();

    const accountsButton = getByAriaLabel(walletPage, 'Accounts');
    await accountsButton.click();
    const accountButton = getByAriaLabel(walletPage, accountName, true);
    await accountButton.click();
  }

  getWalletPage() {
    const walletPage = this.context.pages().find((page) => {
      const url = page.url();
      return url.includes('/popup.html#/wallet');
    });

    if (!walletPage) {
      throw new Error('Wallet Page could not be found');
    }

    return walletPage;
  }
}
