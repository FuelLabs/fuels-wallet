import { Signer } from '@fuel-ts/signer';
import type { Account, Asset } from '@fuel-wallet/types';
import { expect } from '@playwright/test';
import { bn, hashMessage, Wallet } from 'fuels';

import {
  seedWallet,
  getButtonByText,
  getByAriaLabel,
  hasText,
  waitAriaLabel,
  reload,
  getElementByText,
} from '../commons';
import { CUSTOM_ASSET, CUSTOM_ASSET_2, PRIVATE_KEY } from '../mocks';

import {
  test,
  waitWalletToLoad,
  getAccountByName,
  switchAccount,
  waitAccountPage,
  getWalletAccounts,
} from './utils';

const WALLET_PASSWORD = 'Qwe123456$';

test.describe('FuelWallet Extension', () => {
  test('On install sign-up page is open', async ({ context }) => {
    // In development mode files are render dynamically
    // making this first page to throw an error File not found.
    if (process.env.NODE_ENV !== 'test') return;

    const page = await context.waitForEvent('page', {
      predicate: (page) => {
        return page.url().includes('sign-up');
      },
    });
    expect(page.url()).toContain('sign-up');
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
    expect(page.url()).toContain('sign-up');
  });

  test('SDK operations', async ({ context, baseURL, extensionId }) => {
    // Use a single instance of the page to avoid
    // multiple waiting times, and window.fuel checking.
    const blankPage = await context.newPage();

    // Open a blank html in order for the CRX
    // to inject fuel on the window. This is required
    // because the CRX is injected after load state of
    // the page.
    await blankPage.goto(new URL('e2e.html', baseURL).href);

    await test.step('Should trigger event FuelLoaded', async () => {
      // Reload and don't wait for loadstate to go to evaluate
      // This is required in order to get the `FuelLoaded` event
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
      expect(hasTriggerFuelLoaded).toBeTruthy();
    });

    await test.step('Has window.fuel', async () => {
      const hasFuel = await blankPage.evaluate(async () => {
        return typeof window.fuel === 'object';
      });
      expect(hasFuel).toBeTruthy();
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
      expect(connectionStatus).toBeTruthy();
      await swPage.close();
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
      await passwordInput.type(WALLET_PASSWORD);
      await passwordInput.press('Tab');
      const confirmPasswordInput = getByAriaLabel(page, 'Confirm Password');
      await confirmPasswordInput.type(WALLET_PASSWORD);
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

    await test.step('Add more accounts', async () => {
      async function createAccount() {
        await waitWalletToLoad(popupPage);
        const accounts = await getWalletAccounts(popupPage);
        await getByAriaLabel(popupPage, 'Accounts').click();
        await getByAriaLabel(popupPage, 'Add account').click();
        await waitAccountPage(popupPage, `Account ${accounts.length + 1}`);
      }

      async function createAccountFromPrivateKey(
        privateKey: string,
        name: string
      ) {
        await waitWalletToLoad(popupPage);
        await getByAriaLabel(popupPage, 'Accounts').click();
        await getByAriaLabel(popupPage, 'Import from private key').click();
        await getByAriaLabel(popupPage, 'Private Key').type(privateKey);
        if (name) {
          await getByAriaLabel(popupPage, 'Account Name').clear();
          await getByAriaLabel(popupPage, 'Account Name').type(name);
        }
        await getByAriaLabel(popupPage, 'Import').click();
        await waitAccountPage(popupPage, name);
      }

      await createAccount();
      await createAccount();
      await createAccountFromPrivateKey(PRIVATE_KEY, 'Account 4');
      await switchAccount(popupPage, 'Account 1');
    });

    async function connectAccounts() {
      const isConnected = blankPage.evaluate(async () => {
        return window.fuel.connect();
      });
      const authorizeRequest = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });

      // Add Account 3 to the DApp connection
      await getByAriaLabel(authorizeRequest, 'Toggle Account 3').click();
      // Add Account 4 to the DApp connection
      await getByAriaLabel(authorizeRequest, 'Toggle Account 4').click();

      await hasText(authorizeRequest, /connect/i);
      await getButtonByText(authorizeRequest, /next/i).click();
      await hasText(authorizeRequest, /accounts/i);
      await getButtonByText(authorizeRequest, /connect/i).click();

      expect(await isConnected).toBeTruthy();
    }

    await test.step('window.fuel.connect()', async () => {
      await connectAccounts();
    });

    await test.step('window.fuel.disconnect()', async () => {
      const isDisconnected = blankPage.evaluate(async () => {
        return window.fuel.disconnect();
      });

      expect(await isDisconnected).toBeTruthy();
      // we need to reconnect the accounts for later tests
      await connectAccounts();
    });

    await test.step('window.fuel.on("connection")', async () => {
      const onDeleteConnection = blankPage.evaluate(() => {
        return new Promise((resolve) => {
          window.fuel.on(window.fuel.events.connection, (isConnected) => {
            resolve(isConnected);
          });
        });
      });
      // Disconnect accounts from inside the `Connected Apps` page
      await getByAriaLabel(popupPage, 'Menu').click();
      const connectedApps = await hasText(popupPage, 'Connected Apps');
      await connectedApps.click();
      await getByAriaLabel(popupPage, 'Delete').click();
      await getButtonByText(popupPage, 'Confirm').click();

      const isConnectedResult = await onDeleteConnection;
      expect(isConnectedResult).toBeFalsy();

      await getByAriaLabel(popupPage, 'Menu').click();
      (await hasText(popupPage, 'Wallet')).click();

      await connectAccounts();
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
      const authorizedAccount3 = await getAccountByName(popupPage, 'Account 4');
      const accounts = await blankPage.evaluate(async () => {
        return window.fuel.accounts();
      });
      await expect(accounts).toEqual([
        authorizedAccount.address,
        authorizedAccount2.address,
        authorizedAccount3.address,
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

        // Recover signer address
        const messageSigned = await signedMessagePromise;
        const addressSigner = Signer.recoverAddress(
          hashMessage(message),
          messageSigned
        );

        // Verify signature is from the account selected
        expect(addressSigner.toString()).toBe(authorizedAccount.address);
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

      await test.step('Signed message using authorized Account 4 (from Private Key)', async () => {
        const authorizedAccount = await getAccountByName(
          popupPage,
          'Account 4'
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

        // Wait for approve transaction page to show
        const approveTransactionPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });

        // Approve transaction
        await hasText(approveTransactionPage, /0\.0000001.ETH/i);
        await waitAriaLabel(
          approveTransactionPage,
          senderAccount.address.toString()
        );
        await hasText(approveTransactionPage, /Confirm before approving/i);
        await getButtonByText(approveTransactionPage, /Approve/i).click();

        await expect(transferStatus).resolves.toBe('success');
        const balance = await receiverWallet.getBalance();
        expect(balance.toNumber()).toBe(AMOUNT_TRANSFER);
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

      await test.step('Send transfer using authorized Account 4 (from Private Key)', async () => {
        const authorizedAccount = await getAccountByName(
          popupPage,
          'Account 4'
        );
        await approveTxCheck(authorizedAccount);
      });

      await test.step('Send transfer should block unauthorized account', async () => {
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

    await test.step('window.fuel.assets()', async () => {
      const assets = await blankPage.evaluate(async () => {
        return window.fuel.assets();
      });
      expect(assets.length).toEqual(1);
    });

    await test.step('window.fuel.addAsset()', async () => {
      function addAsset(asset: Asset) {
        return blankPage.evaluate(
          async ([asset]) => {
            return window.fuel.addAsset(asset);
          },
          [asset]
        );
      }

      const addingAsset = addAsset(CUSTOM_ASSET);

      const addAssetPage = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });
      await hasText(addAssetPage, 'Review the Assets to be added:');
      await getButtonByText(addAssetPage, /add assets/i).click();
      await expect(addingAsset).resolves.toBeDefined();
    });

    await test.step('window.fuel.addAssets()', async () => {
      function addAssets(assets: Asset[]) {
        return blankPage.evaluate(
          async ([asset]) => {
            return window.fuel.addAssets(asset);
          },
          [assets]
        );
      }

      const addingAsset = addAssets([CUSTOM_ASSET, CUSTOM_ASSET_2]);

      const addAssetPage = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });
      await hasText(addAssetPage, 'Review the Assets to be added:');
      await getButtonByText(addAssetPage, /add assets/i).click();
      await expect(addingAsset).resolves.toBeDefined();
    });

    await test.step('window.fuel.on("currentAccount")', async () => {
      // Switch to account 2
      await switchAccount(popupPage, 'Account 2');

      const onChangeAccountPromise = blankPage.evaluate(() => {
        return new Promise((resolve) => {
          window.fuel.on(window.fuel.events.currentAccount, (account) => {
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

    // await test.step('Auto lock fuel wallet', async () => {
    //   await popupPage.waitForTimeout(60_000);
    //   await hasText(popupPage, 'Unlock your wallet to continue');
    // });
  });
});

// Increase timeout for this test
// The timeout is set for 2 minutes
// because some tests like reconnect
// can take up to 1 minute before it's reconnected
test.setTimeout(120_000);
