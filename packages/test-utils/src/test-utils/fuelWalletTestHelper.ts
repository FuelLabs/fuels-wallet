import { type BrowserContext } from '@playwright/test';

import { expect } from '../fixtures';
import { FUEL_MNEMONIC, FUEL_WALLET_PASSWORD } from '../mocks';
import { shortAddress } from '../utils';

import { getButtonByText } from './button';
import { getByAriaLabel } from './locator';

export class FuelWalletTestHelper {
  private context;
  private walletPage;

  private constructor(context: BrowserContext) {
    this.context = context;
    const walletPage = this.context.pages().find((page) => {
      const url = page.url();
      return url.includes('/popup.html#/wallet');
    });

    if (!walletPage) {
      throw new Error('Wallet Page could not be found');
    }

    this.walletPage = walletPage;
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

    const fuelWalletTestHelper = new FuelWalletTestHelper(context);

    await fuelWalletTestHelper.addNetwork(chainName, fuelProviderUrl);

    return fuelWalletTestHelper;
  }

  async walletConnect(
    accountNames?: string[],
    connectCurrentAccount: boolean = true
  ) {
    const walletNotificationPage = await this.getWalletPopupPage();

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
    const walletPage = await this.getWalletPopupPage();

    const approveButton = getButtonByText(walletPage, 'Approve');
    await approveButton.click();
  }

  async getWalletPopupPage() {
    let walletNotificationPage = this.context.pages().find((page) => {
      const url = page.url();
      return url.includes('/popup.html?');
    });

    if (!walletNotificationPage) {
      walletNotificationPage = await this.context.waitForEvent('page', {
        predicate: (page) => page.url().includes('/popup'),
        timeout: 5000,
      });
    }

    if (!walletNotificationPage) {
      throw new Error('Wallet popup not found!');
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
    const accountsButton = getByAriaLabel(this.walletPage, 'Accounts');
    await accountsButton.click();
    const addAccountButton = getByAriaLabel(this.walletPage, 'Add account');
    await addAccountButton.click();
  }

  async switchAccount(accountName: string) {
    const accountsButton = getByAriaLabel(this.walletPage, 'Accounts');
    await accountsButton.click();
    const accountButton = getByAriaLabel(this.walletPage, accountName, true);
    await accountButton.click();
  }

  async addNetwork(chainName: string, providerUrl: string) {
    const networksButton = getByAriaLabel(this.walletPage, 'Selected Network');
    await networksButton.click();

    if ((await this.walletPage.getByText(chainName).count()) === 0) {
      const addNetworkButton = getByAriaLabel(this.walletPage, 'Add network');
      await addNetworkButton.click();

      const urlInput = getByAriaLabel(this.walletPage, 'Network url');
      await urlInput.fill(providerUrl);

      const addNewNetworkButton = getByAriaLabel(
        this.walletPage,
        'Add new network'
      );
      await addNewNetworkButton.click();
    } else {
      const closeNetworkButton = getByAriaLabel(
        this.walletPage,
        'Close dialog'
      );
      await closeNetworkButton.click();
    }
  }

  async switchNetwork(chainName: string) {
    const networksButton = getByAriaLabel(this.walletPage, 'Selected Network');
    await networksButton.click();
    const networkButton = getByAriaLabel(this.walletPage, chainName, true);
    await networkButton.click();
  }

  getWalletPage() {
    return this.walletPage;
  }
}
