import { expect } from '@playwright/test';

import {
  getButtonByText,
  getByAriaLabel,
  getElementByText,
  hasText,
  reload,
} from '../commons';
import { WALLET_PASSWORD } from '../mocks';

import { test } from './utils';

// Increase timeout for this test
// The timeout is set for 6 minutes
// because some tests like reconnect
// can take up to 1 minute before it's reconnected
test.setTimeout(360_000);

test.describe('Lock FuelWallet after inactivity', () => {
  test('If user opens popup it should force open a sign-up page', async ({
    context,
    extensionId,
  }) => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);
    const page = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('sign-up'),
    });
    expect(page.url()).toContain('sign-up');
  });

  test('should lock the wallet after 1 minute of inactivity (config in .env file)', async ({
    context,
    baseURL,
    extensionId,
  }) => {
    // Use a single instance of the page to avoid
    // multiple waiting times, and window.fuel checking.
    const blankPage = await context.newPage();

    // Open a blank html in order for the CRX
    // to inject fuel on the window. This is required
    // because the CRX is injected after load state of
    // the page.
    await blankPage.goto(new URL('e2e.html', baseURL).href);

    await test.step('Has window.fuel', async () => {
      const hasFuel = await blankPage.evaluate(async () => {
        const maxRetries = 20;
        const interval = 1000; // ms
        for (let i = 0; i < maxRetries; i++) {
          if (typeof window.fuel === 'object') {
            return true;
          }
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
        return false;
      });
      expect(hasFuel).toBeTruthy();
    });

    await test.step('Create wallet', async () => {
      const pages = context.pages();
      const [page] = pages.filter((page) => page.url().includes('sign-up'));
      await reload(page);
      await getElementByText(page, /Create new wallet/i).click();

      /** Accept terms */
      await hasText(page, /Terms of use Agreement/i);
      const agreeCheckbox = getByAriaLabel(page, 'Agree with terms');
      await agreeCheckbox.click();
      await getButtonByText(page, /Next: Seed Phrase/i).click();

      /** Copy Mnemonic */
      await hasText(page, /Write down seed phrase/i);
      await getButtonByText(page, /Copy/i).click();
      const savedCheckbox = getByAriaLabel(page, 'Confirm Saved');
      await savedCheckbox.click();
      await getButtonByText(page, /Next/i).click();

      /** Confirm Mnemonic */
      await hasText(page, /Confirm phrase/i);
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
      await hasText(page, /Wallet created successfully/i, 0, 15000);

      await page.close();
    });

    const popupPage = await test.step('Open wallet', async () => {
      const page = await context.newPage();
      await page.goto(`chrome-extension://${extensionId}/popup.html`);
      await hasText(page, /Assets/i);
      return page;
    });

    await test.step('Verify wallet stays unlocked while open', async () => {
      await getByAriaLabel(popupPage, 'Accounts').click();
      await popupPage.waitForTimeout(65_000);
      await hasText(popupPage, /Assets/i);

      const pages = context.pages();
      const walletPages = pages.filter((page) => {
        return page.url().includes('chrome-extension://');
      });
      for (const page of walletPages) {
        await page.close();
      }
    });

    await test.step('Resume auto-lock timer after closing wallet', async () => {
      const page = await context.newPage();
      await page.waitForTimeout(65_000);
      await page.goto(`chrome-extension://${extensionId}/popup.html`);
      await hasText(page, 'Unlock your wallet to continue');
    });
  });
});
