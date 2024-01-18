import type { Account, Asset } from '@fuel-wallet/sdk';
import { expect } from '@playwright/test';
import { Signer, bn, hashMessage, Wallet, Provider } from 'fuels';

import {
  seedWallet,
  getButtonByText,
  getByAriaLabel,
  hasText,
  waitAriaLabel,
  reload,
  getElementByText,
} from '../commons';
import {
  CUSTOM_ASSET_INPUT,
  CUSTOM_ASSET_INPUT_2,
  FUEL_NETWORK,
  PRIVATE_KEY,
} from '../mocks';

import {
  test,
  waitWalletToLoad,
  getAccountByName,
  switchAccount,
  waitAccountPage,
  getWalletAccounts,
  hideAccount,
} from './utils';

const WALLET_PASSWORD = 'Qwe123456$';

/**
 * @todo: skip e2e tests of the wallet application for implement it on the next PR
 */
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

    await test.step('Has window.fuel', async () => {
      const hasFuel = await blankPage.evaluate(async () => {
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
        await getByAriaLabel(popupPage, 'Private Key').fill(privateKey);
        if (name) {
          await getByAriaLabel(popupPage, 'Account Name').clear();
          await getByAriaLabel(popupPage, 'Account Name').fill(name);
        }
        await getByAriaLabel(popupPage, 'Import').click();
        await waitAccountPage(popupPage, name);
      }

      await createAccount();
      await createAccount();
      await createAccountFromPrivateKey(PRIVATE_KEY, 'Account 4');
      await createAccount();
      await createAccount();
      await switchAccount(popupPage, 'Account 1');
      await hideAccount(popupPage, 'Account 5');
    });

    async function connectAccounts() {
      const connectionResponse = blankPage.evaluate(async () => {
        return window.fuel.connect();
      });
      const authorizeRequest = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });

      // Add Account 3 to the DApp connection
      await getByAriaLabel(authorizeRequest, 'Toggle Account 3').click();
      // Add Account 4 to the DApp connection
      await getByAriaLabel(authorizeRequest, 'Toggle Account 4').click();

      // Account 5 (Hidden) should not be shown to connect
      await expect(async () => {
        await getByAriaLabel(authorizeRequest, 'Toggle Account 5').click({
          timeout: 3000,
        });
      }).rejects.toThrow();

      await hasText(authorizeRequest, /connect/i);
      await getButtonByText(authorizeRequest, /next/i).click();
      await hasText(authorizeRequest, /accounts/i);
      await getButtonByText(authorizeRequest, /connect/i).click();

      expect(await connectionResponse).toBeTruthy();
      const isConnected = blankPage.evaluate(async () => {
        return window.fuel.isConnected();
      });
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
        await getByAriaLabel(popupPage, 'Accounts').click({ delay: 1000 });
        await getByAriaLabel(popupPage, `Close dialog`).click();
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
            const receiver = window.createAddress(receiverAddress as string);
            const wallet = await window.fuel!.getWallet(
              senderAddress as string
            );

            // TODO: remove this gas config once SDK fixes and start with correct values
            const chain = await wallet.provider.getChain();
            const nodeInfo = await wallet.provider.fetchNode();
            const gasLimit = chain.consensusParameters.maxGasPerTx.div(2);
            const gasPrice = nodeInfo.minGasPrice;
            const response = await wallet.transfer(
              receiver,
              Number(amount),
              undefined,
              { gasPrice, gasLimit }
            );
            const result = await response.waitForResult();
            return result.status;
          },
          [senderAddress, receiverAddress, String(amount)]
        );
      }

      async function approveTxCheck(senderAccount: Account) {
        const provider = await Provider.create(
          process.env.VITE_FUEL_PROVIDER_URL
        );
        const receiverWallet = Wallet.generate({
          provider,
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
        const provider = await Provider.create(
          process.env.VITE_FUEL_PROVIDER_URL
        );
        const receiverWallet = Wallet.generate({
          provider,
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

      const addingAsset = addAsset(CUSTOM_ASSET_INPUT);

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

      const addingAsset = addAssets([CUSTOM_ASSET_INPUT, CUSTOM_ASSET_INPUT_2]);

      const addAssetPage = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });
      await hasText(addAssetPage, 'Review the Assets to be added:');
      await getButtonByText(addAssetPage, /add assets/i).click();
      await expect(addingAsset).resolves.toBeDefined();
    });

    await test.step('window.fuel.addNetwork()', async () => {
      function addNetwork(network: string) {
        return blankPage.evaluate(
          async ([network]) => {
            return window.fuel.addNetwork(network);
          },
          [network]
        );
      }

      async function testAddNetwork() {
        const addingNetwork = addNetwork(FUEL_NETWORK.url);

        const addNetworkPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });

        await hasText(addNetworkPage, 'Review the Network to be added:');
        await getButtonByText(addNetworkPage, /add network/i).click();
        await expect(addingNetwork).resolves.toBeDefined();
        await popupPage.reload();
      }

      // Add network
      await testAddNetwork();

      // Check if added network is selected
      let networkSelector = getByAriaLabel(popupPage, 'Selected Network');
      await expect(networkSelector).toHaveText(/Testnet Beta 4/);

      // Remove added network
      await networkSelector.click();
      const items = popupPage.locator('[aria-label*=fuel_network]');
      const networkItemsCount = await items.count();
      expect(networkItemsCount).toEqual(2);

      let selectedNetworkItem;
      for (let i = 0; i < networkItemsCount; i += 1) {
        const isSelected = await items.nth(i).getAttribute('data-active');
        if (isSelected === 'true') {
          selectedNetworkItem = items.nth(i);
        }
      }
      await selectedNetworkItem.getByLabel(/Remove/).click();
      await hasText(popupPage, /Are you sure/i);
      await getButtonByText(popupPage, /confirm/i).click();
      await expect(items).toHaveCount(1);
      await expect(items.first()).toHaveAttribute('data-active', 'true');

      // Re-add network
      await testAddNetwork();

      // Check if re-added network is selected
      networkSelector = getByAriaLabel(popupPage, 'Selected Network');
      await expect(networkSelector).toHaveText(/Testnet Beta 4/);
    });

    await test.step('window.fuel.on("currentAccount") to a connected account', async () => {
      // Switch to account 2
      await switchAccount(popupPage, 'Account 2');
      await getByAriaLabel(popupPage, 'Accounts').click({ delay: 1000 });
      await getByAriaLabel(popupPage, `Close dialog`).click();

      const onChangeAccountPromise = blankPage.evaluate(() => {
        return new Promise((resolve) => {
          window.fuel.on(window.fuel.events.currentAccount, (account) => {
            resolve(account);
          });
        });
      });

      // Switch to account 1
      const currentAccount = await switchAccount(popupPage, 'Account 1');

      // Check result
      const currentAccountEventResult = await onChangeAccountPromise;
      expect(currentAccountEventResult).toEqual(currentAccount.address);
    });

    await test.step('window.fuel.on("currentAccount") should be null when not connected', async () => {
      // Switch to account 2
      await switchAccount(popupPage, 'Account 2');
      await getByAriaLabel(popupPage, 'Accounts').click({ delay: 1000 });
      await getByAriaLabel(popupPage, `Close dialog`).click();

      const onChangeAccountPromise = blankPage.evaluate(() => {
        return new Promise((resolve) => {
          window.fuel.on(window.fuel.events.currentAccount, (account) => {
            resolve(account);
          });
        });
      });

      // Switch to account 1
      await switchAccount(popupPage, 'Account 6');

      // Check result
      const currentAccountEventResult = await onChangeAccountPromise;
      expect(currentAccountEventResult).toEqual(null);
    });

    await test.step('Auto lock fuel wallet', async () => {
      await getByAriaLabel(popupPage, 'Accounts').click({ delay: 65000 });
      await hasText(popupPage, 'Unlock your wallet to continue');
    });
  });
});

// Increase timeout for this test
// The timeout is set for 2 minutes
// because some tests like reconnect
// can take up to 1 minute before it's reconnected
test.setTimeout(180_000);
