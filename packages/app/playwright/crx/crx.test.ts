import { expect } from '@playwright/test';
import { bn, Wallet } from 'fuels';

import {
  getButtonByText,
  getByAriaLabel,
  getInputByName,
  hasText,
} from '../commons';
import { seedWallet } from '../commons/seedWallet';

import { test } from './utils';

const WALLET_PASSWORD = '12345678';

test.describe('FuelWallet Extension', () => {
  test('On install sign-up page is open', async ({ context }) => {
    // In development mode files are render dynamically
    // making this first page to throw a error File not found.
    if (process.env.NODE_ENV !== 'test') return;

    const page = await context.waitForEvent('page', {
      predicate: (page) => {
        return page.url().includes('sign-up');
      },
    });
    await expect(page.url()).toContain('sign-up');
    await page.close();
  });

  test('If user opens popup it should force open a sign-up page', async ({
    context,
    extensionId,
  }) => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);
    const page = await context.waitForEvent('page', {
      predicate: (page) => page.url().includes('sign-up'),
    });
    await expect(page.url()).toContain('sign-up');
  });

  test('SDK operations', async ({ context, baseURL, extensionId }) => {
    // Use a single instance of the page to avoid
    // mutiple waiting times, and window.fuel checking.
    const blankPage = await context.newPage();
    // Open a blank html in order for the CRX
    // to inject fuel on the window. This is required
    // because the CRX is injected after load state of
    // the page.
    await blankPage.goto(new URL('e2e.html', baseURL).href);
    await blankPage.waitForTimeout(5000);

    await test.step('Create wallet', async () => {
      const pages = await context.pages();
      const [page] = pages.filter((page) => page.url().includes('sign-up'));
      await getButtonByText(page, /Create a Wallet/i).click();

      /** Copy Mnemonic */
      await getButtonByText(page, /Copy/i).click();
      await page.getByRole('checkbox').click();
      await getButtonByText(page, /Next/i).click();

      /** Confirm Mnemonic */
      await hasText(page, /Write down your Recovery Phrase/i);
      await getButtonByText(page, /Paste/i).click();
      await getButtonByText(page, /Next/i).click();

      /** Adding password */
      await hasText(page, /Create your password/i);
      await getByAriaLabel(page, 'Your Password').type(WALLET_PASSWORD);
      await getByAriaLabel(page, 'Confirm Password').type(WALLET_PASSWORD);
      await page.getByRole('checkbox').click();
      await getButtonByText(page, /Next/i).click();

      /** Account created */
      await hasText(page, /Wallet created successfully/i);
      await page.close();
    });

    await test.step('Check if fuel was inject on the window', async () => {
      const hasFuel = await blankPage.evaluate(() => {
        return typeof window.fuel === 'object';
      });
      expect(hasFuel).toBeTruthy();
    });

    await test.step('window.fuel.connect()', async () => {
      const isConnected = blankPage.evaluate(async () => {
        return window.fuel.connect();
      });
      const authorizeRequest = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });

      await hasText(authorizeRequest, /connect/i);
      await getButtonByText(authorizeRequest, /next/i).click();
      await hasText(authorizeRequest, /accounts/i);
      await getButtonByText(authorizeRequest, /connect/i).click();

      expect(await isConnected).toBeTruthy();
    });

    await test.step('window.fuel.accounts()', async () => {
      const accounts = await blankPage.evaluate(async () => {
        return window.fuel.accounts();
      });
      expect(accounts).toHaveLength(1);
    });

    await test.step('window.fuel.currentAccount()', async () => {
      const currentAccount = await blankPage.evaluate(async () => {
        return window.fuel.currentAccount();
      });
      expect(currentAccount).toBeTruthy();
    });

    await test.step('window.fuel.signMessage()', async () => {
      const message = 'Hello World';
      const signedMessage = blankPage.evaluate(
        async ([message]) => {
          const currentAccount = await window.fuel.currentAccount();
          return window.fuel.signMessage(currentAccount, message);
        },
        [message]
      );
      const signMessageRequest = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });

      // Confirm signature
      await hasText(signMessageRequest, message);
      await getButtonByText(signMessageRequest, /sign/i).click();
      await getInputByName(signMessageRequest, 'password').type(
        WALLET_PASSWORD
      );
      await getButtonByText(signMessageRequest, /unlock/i).click();

      expect(await signedMessage).toHaveLength(130);
    });

    await test.step('window.fuel.getWallet()', async () => {
      const isCorrectAddress = await blankPage.evaluate(async () => {
        const currentAccount = await window.fuel.currentAccount();
        const wallet = await window.fuel.getWallet(currentAccount);
        return wallet.address.toString() === currentAccount;
      });
      expect(isCorrectAddress).toBeTruthy();
    });

    await test.step('window.fuel.sendTransaction()', async () => {
      const receiverWallet = Wallet.generate({
        provider: process.env.VITE_FUEL_PROVIDER_URL,
      });
      const currentAccount = await blankPage.evaluate(async () => {
        return window.fuel.currentAccount();
      });
      // Add some coins to the account
      await seedWallet(currentAccount, bn(1000));

      // Create transfer
      const transferStatus = blankPage.evaluate(
        async ([currentAccount, address]) => {
          const receiver = await window.fuel.utils.createAddress(address);
          const wallet = await window.fuel.getWallet(currentAccount);
          const response = await wallet.transfer(receiver, 100);
          const result = await response.waitForResult();
          return result.status.type;
        },
        [currentAccount, receiverWallet.address.toString()]
      );
      // Wait confirmation page to show
      const confirmTransactionPage = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });

      // Confirm transaction
      await hasText(confirmTransactionPage, /0\.0000001.ETH/i);
      await getButtonByText(confirmTransactionPage, /confirm/i).click();
      await getInputByName(confirmTransactionPage, 'password').type(
        WALLET_PASSWORD
      );
      await getButtonByText(
        confirmTransactionPage,
        /confirm transaction/i
      ).click();

      expect(await transferStatus).toBe('success');
      expect((await receiverWallet.getBalance()).toNumber()).toBe(100);
    });

    await test.step('window.fuel.on("currentAccount")', async () => {
      const evtHold = blankPage.evaluate(() => {
        return new Promise((resolve) => {
          window.fuel.on('currentAccount', (account) => {
            resolve(account);
          });
        });
      });

      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

      /** Open Accounts */
      await getByAriaLabel(popupPage, 'Accounts').click();

      /** Get addess of connected account */
      await hasText(popupPage, 'Account 1');

      /** Create Account 2 (not connected) */
      await getByAriaLabel(popupPage, 'Add account').click();
      await getByAriaLabel(popupPage, 'Account Name').type('Account 2');
      await getByAriaLabel(popupPage, 'Create new account').click();

      /** Unlock wallet */
      await getInputByName(popupPage, 'password').type(WALLET_PASSWORD);
      await getButtonByText(popupPage, /add account/i).click();

      await hasText(popupPage, 'Assets', 0, 10000);

      /** Switch back to Account 1 */
      await getByAriaLabel(popupPage, 'Accounts').click();
      await getByAriaLabel(popupPage, 'Account 1').click();

      const jsHandle = await popupPage.waitForFunction(async () => {
        const accounts = await window.fuelDB.accounts.toArray();
        return accounts.find((account) => account.name === 'Account 1');
      });
      const account = await jsHandle.jsonValue();

      /** Check result */
      const currentAccount = await evtHold;
      expect(currentAccount).toEqual(account.address);

      await popupPage.close();
    });
  });
});
