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
// The timeout is set for 2 minutes
// because some tests like reconnect
// can take up to 1 minute before it's reconnected
test.setTimeout(180_000);

test.describe('Lock FuelWallet after inactivity', () => {
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
        // wait for the script to load
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return typeof window.fuel === 'object';
      });
      expect(hasFuel).toBeTruthy();
    });

    await test.step('Should return current version of Wallet', async () => {
      const version = await blankPage.evaluate(async () => {
        return window.fuel.version();
      });
      expect(version).toEqual(process.env.VITE_APP_VERSION);
    });

    await test.step('Should reconnect if service worker stops', async () => {
      // Stop service worker
      const swPage = await context.newPage();
      await swPage.goto('chrome://serviceworker-internals', {
        waitUntil: 'domcontentloaded',
      });
      await swPage.getByRole('button', { name: 'Stop' }).click();
      // Wait service worker to reconnect
      const pingRet = await blankPage.waitForFunction(async () => {
        async function testConnection() {
          try {
            await window.fuel.ping();
            return true;
          } catch (_err) {
            return testConnection();
          }
        }
        return testConnection();
      });
      const connectionStatus = await pingRet.jsonValue();
      expect(connectionStatus).toBeTruthy();
      await swPage.close();
    });

    await test.step('Create wallet', async () => {
      const pages = context.pages();
      await blankPage.pause();
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

    await test.step('Auto lock fuel wallet', async () => {
      await getByAriaLabel(popupPage, 'Accounts').click();
      await popupPage.waitForTimeout(65_000);
      await hasText(popupPage, 'Unlock your wallet to continue');
    });
  });
});
