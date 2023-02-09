import { Signer } from '@fuel-ts/signer';
import type { Account } from '@fuel-wallet/types';
import { expect } from '@playwright/test';
import { bn, hashMessage, Wallet } from 'fuels';

import {
  seedWallet,
  getButtonByText,
  getByAriaLabel,
  getInputByName,
  hasText,
  waitAriaLabel,
} from '../commons';

import {
  test,
  waitWalletToLoad,
  getAccountByName,
  switchAccount,
  unlockWallet,
  waitAccountPage,
} from './utils';

const WALLET_PASSWORD = 'Qwe123456$';

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

    await test.step('Should trigger event FuelLoaded', async () => {
      // Reload and don't wait for laodstate to go to evalute
      // This is required in order to get the FuelLoaded event
      await blankPage.reload({
        waitUntil: 'commit',
      });
      const hasTriggerFuelLoaded = await blankPage.evaluate(async () => {
        return new Promise((resolve) => {
          document.addEventListener('FuelLoaded', () => {
            resolve(typeof window.fuel !== 'undefined');
          });
        });
      });
      await expect(hasTriggerFuelLoaded).toBeTruthy();
    });

    await test.step('Has window.fuel', async () => {
      const hasFuel = await blankPage.evaluate(async () => {
        return typeof window.fuel === 'object';
      });
      await expect(hasFuel).toBeTruthy();
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
          } catch (err) {
            return testConnection();
          }
        }
        return testConnection();
      });
      const connectionStatus = await pingRet.jsonValue();
      await expect(connectionStatus).toBeTruthy();
      await swPage.close();
    });

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
      const passwordInput = await getByAriaLabel(page, 'Your Password');
      await passwordInput.type(WALLET_PASSWORD);
      await passwordInput.press('Tab');
      const confirmPasswordInput = await getByAriaLabel(
        page,
        'Confirm Password'
      );
      await confirmPasswordInput.type(WALLET_PASSWORD);
      await confirmPasswordInput.press('Tab');

      await page.getByRole('checkbox').click();
      await getButtonByText(page, /Next/i).click();

      /** Account created */
      await hasText(page, /Wallet created successfully/i);
      await page.close();
    });

    const popupPage = await test.step('Open wallet', async () => {
      const page = await context.newPage();
      await page.goto(`chrome-extension://${extensionId}/popup.html`);
      await hasText(page, /Assets/i);
      return page;
    });

    await test.step('Add more accounts', async () => {
      async function createAccount(name: string) {
        await waitWalletToLoad(popupPage);
        await getByAriaLabel(popupPage, 'Accounts').click();
        await getByAriaLabel(popupPage, 'Add account').click();
        await getByAriaLabel(popupPage, 'Account Name').type(name);
        await getByAriaLabel(popupPage, 'Create new account').click();
        await getInputByName(popupPage, 'password').type(WALLET_PASSWORD);
        await getButtonByText(popupPage, /add account/i).click();
        await waitAccountPage(popupPage, name);
      }

      await createAccount('Account 2');
      await createAccount('Account 3');
      await switchAccount(popupPage, 'Account 1');
    });

    // Connect Account 1 to the DApp.
    await test.step('window.fuel.connect()', async () => {
      const isConnected = blankPage.evaluate(async () => {
        return window.fuel.connect();
      });
      const authorizeRequest = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });

      // Add Account 3 to the DApp connection
      await getByAriaLabel(authorizeRequest, 'Toggle Account 3').click();

      await hasText(authorizeRequest, /connect/i);
      await getButtonByText(authorizeRequest, /next/i).click();
      await hasText(authorizeRequest, /accounts/i);
      await getButtonByText(authorizeRequest, /connect/i).click();

      await expect(await isConnected).toBeTruthy();
    });

    await test.step('window.fuel.getWallet()', async () => {
      const isCorrectAddress = await blankPage.evaluate(async () => {
        const currentAccount = await window.fuel.currentAccount();
        const wallet = await window.fuel.getWallet(currentAccount);
        return wallet.address.toString() === currentAccount;
      });
      await expect(isCorrectAddress).toBeTruthy();
    });

    await test.step('window.fuel.accounts()', async () => {
      const authorizedAccount = await getAccountByName(popupPage, 'Account 1');
      const authorizedAccount2 = await getAccountByName(popupPage, 'Account 3');
      const accounts = await blankPage.evaluate(async () => {
        return window.fuel.accounts();
      });
      await expect(accounts).toEqual([
        authorizedAccount.address,
        authorizedAccount2.address,
      ]);
    });

    await test.step('window.fuel.currentAccount()', async () => {
      await test.step('Current authorized current Account', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 1');
        const currentAccountPromise = await blankPage.evaluate(async () => {
          return window.fuel.currentAccount();
        });
        await expect(currentAccountPromise).toBe(authorizedAccount.address);
      });

      await test.step('Throw on not Authorized Account', async () => {
        await switchAccount(popupPage, 'Account 2');
        const currentAccountPromise = blankPage.evaluate(async () => {
          return window.fuel.currentAccount();
        });
        await expect(currentAccountPromise).rejects.toThrowError(
          'address is not authorized for this connection.'
        );
      });
    });

    await test.step('window.fuel.signMessage()', async () => {
      const message = 'Hello World';

      function signMessage(address: string) {
        return blankPage.evaluate(
          async ([address, message]) => {
            return window.fuel.signMessage(address, message);
          },
          [address, message]
        );
      }

      async function approveMessageSignCheck(authorizedAccount: Account) {
        const signedMessagePromise = signMessage(authorizedAccount.address);
        const signMessageRequest = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });
        // Confirm signature
        await hasText(signMessageRequest, message);
        await waitAriaLabel(signMessageRequest, authorizedAccount.name);
        await getButtonByText(signMessageRequest, /sign/i).click();
        await unlockWallet(signMessageRequest, WALLET_PASSWORD);

        // Recover signer address
        const messageSigned = await signedMessagePromise;
        const addressSigner = Signer.recoverAddress(
          hashMessage(message),
          messageSigned
        );

        // Verify signature is from the account selected
        await expect(addressSigner.toString()).toBe(authorizedAccount.address);
      }

      await test.step('Signed message using authorized Account 1', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 1');
        await approveMessageSignCheck(authorizedAccount);
      });

      await test.step('Signed message using authorized Account 3', async () => {
        const authorizedAccount = await getAccountByName(
          popupPage,
          'Account 3'
        );
        await approveMessageSignCheck(authorizedAccount);
      });

      await test.step('Throw on not Authorized Account', async () => {
        const notAuthorizedAccount = await getAccountByName(
          popupPage,
          'Account 2'
        );
        const signedMessagePromise = signMessage(notAuthorizedAccount.address);

        await expect(signedMessagePromise).rejects.toThrowError(
          'address is not authorized for this connection.'
        );
      });
    });

    await test.step('window.fuel.sendTransaction()', async () => {
      // Create transfer function
      async function transfer(
        senderAddress: string,
        receiverAddress: string,
        amount: number
      ) {
        return blankPage.evaluate(
          async ([senderAddress, receiverAddress, amount]) => {
            const receiver = window.fuel.utils.createAddress(receiverAddress);
            const wallet = await window.fuel!.getWallet(senderAddress);
            const response = await wallet.transfer(receiver, Number(amount));
            const result = await response.waitForResult();
            return result.status.type;
          },
          [senderAddress, receiverAddress, String(amount)]
        );
      }

      async function approveTxCheck(senderAccount: Account) {
        const receiverWallet = Wallet.generate({
          provider: process.env.VITE_FUEL_PROVIDER_URL,
        });
        const AMOUNT_TRANSFER = 100;

        // Add some coins to the account
        await seedWallet(senderAccount.address, bn(100_000_000));

        // Create transfer
        const transferStatus = transfer(
          senderAccount.address,
          receiverWallet.address.toString(),
          AMOUNT_TRANSFER
        );

        // Wait confirmation page to show
        const confirmTransactionPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });

        // Confirm transaction
        await hasText(confirmTransactionPage, /0\.0000001.ETH/i);
        await waitAriaLabel(confirmTransactionPage, senderAccount.name);
        await getButtonByText(confirmTransactionPage, /confirm/i).click();
        await unlockWallet(confirmTransactionPage, WALLET_PASSWORD);

        await expect(transferStatus).resolves.toBe('success');
        const balance = await receiverWallet.getBalance();
        await expect(balance.toNumber()).toBe(AMOUNT_TRANSFER);
      }

      await test.step('Send transfer using authorized Account', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 1');
        await approveTxCheck(authorizedAccount);
      });

      await test.step('Send transfer using authorized Account 3', async () => {
        const authorizedAccount = await getAccountByName(
          popupPage,
          'Account 3'
        );
        await approveTxCheck(authorizedAccount);
      });

      await test.step('Send transfer should block anauthorized account', async () => {
        const nonAuthorizedAccount = await getAccountByName(
          popupPage,
          'Account 2'
        );
        const receiverWallet = Wallet.generate({
          provider: process.env.VITE_FUEL_PROVIDER_URL,
        });
        const AMOUNT_TRANSFER = 100;

        // Add some coins to the account
        await seedWallet(nonAuthorizedAccount.address, bn(100_000_000));

        // Create transfer
        const transferStatus = transfer(
          nonAuthorizedAccount.address,
          receiverWallet.address.toString(),
          AMOUNT_TRANSFER
        );

        await expect(transferStatus).rejects.toThrowError(
          'address is not authorized for this connection.'
        );
      });
    });

    await test.step('window.fuel.on("currentAccount")', async () => {
      // Switch to account 2
      await switchAccount(popupPage, 'Account 2');

      const onChangeAccountPromise = blankPage.evaluate(() => {
        return new Promise((resolve) => {
          window.fuel.on('currentAccount', (account) => {
            resolve(account);
          });
        });
      });

      // Switch to account 1
      const currentAccount = await switchAccount(popupPage, 'Account 1');

      /** Check result */
      const currentAccountEventResult = await onChangeAccountPromise;
      expect(currentAccountEventResult).toEqual(currentAccount.address);
    });
  });
});

// Increase timeout for this test
// The timeout is set for 2 minutes
// because some tests like reconnect
// can take up to 1 minute before it's reconnected
test.setTimeout(120_000);
