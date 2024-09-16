import type { Account as WalletAccount } from '@fuel-wallet/types';
import { type Locator, expect } from '@playwright/test';
import {
  type Asset,
  Provider,
  type SelectNetworkArguments,
  Signer,
  Wallet,
  bn,
  hashMessage,
} from 'fuels';

import {
  delay,
  getButtonByText,
  getByAriaLabel,
  getElementByText,
  hasAriaLabel,
  hasText,
  reload,
  seedWallet,
  waitAriaLabel,
} from '../commons';
import {
  CUSTOM_ASSET_INPUT,
  CUSTOM_ASSET_INPUT_2,
  FUEL_NETWORK,
  PRIVATE_KEY,
} from '../mocks';

import {
  getAccountByName,
  getWalletAccounts,
  hideAccount,
  switchAccount,
  test,
  waitAccountPage,
  waitWalletToLoad,
} from './utils';

const WALLET_PASSWORD = 'Qwe123456$';

const isLocalNetwork = process.env.VITE_FUEL_PROVIDER_URL.includes('localhost');

// Increase timeout for this test
// The timeout is set for 3 minutes
// because some tests like reconnect
// can take up to 1 minute before it's reconnected
test.setTimeout(240_000);

test.describe('FuelWallet Extension', () => {
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
      await reload(blankPage);
      await blankPage.waitForFunction(async () => {
        // needs to select the connector after refresh
        await window.fuel.selectConnector('Fuel Wallet Development');
        await window.fuel.hasConnector();
      });
      const connectionResponse = blankPage.evaluate(async () => {
        const isConnected = await window.fuel.connect();
        if (!isConnected) {
          // throw this error to avoid needing to wait for `fuel.connect` timeout
          throw new Error('Connecting to Fuel Wallet did not work');
        }

        return true;
      });
      const connectPage = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });

      await hasText(connectPage, /connect/i);

      // Account 1 should be toggled by default
      const toggleAccountOneLocator = await getByAriaLabel(
        connectPage,
        'Toggle Account 1'
      );
      // avoid flakiness as if you toggle account 3 and account 4 too quick, account 1 will not be toggled
      await expect(toggleAccountOneLocator).toHaveAttribute(
        'aria-checked',
        'true'
      );

      // Add Account 3 to the DApp connection
      await getByAriaLabel(connectPage, 'Toggle Account 3').click();
      // Add Account 4 to the DApp connection
      await getByAriaLabel(connectPage, 'Toggle Account 4').click();

      // Account 5 (Hidden) should not be shown to connect
      await expect(async () => {
        await getByAriaLabel(connectPage, 'Toggle Account 5').click({
          timeout: 3000,
        });
      }).rejects.toThrow();

      await hasText(connectPage, /connect/i);

      await getButtonByText(connectPage, /next/i).click();
      await hasText(connectPage, /accounts/i);
      await getButtonByText(connectPage, /connect/i).click();

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

      await blankPage.waitForTimeout(1_000);
      const isConnected = blankPage.evaluate(async () => {
        return window.fuel.isConnected();
      });
      expect(await isConnected).toBeFalsy();

      // we need to reconnect the accounts to continue the tests
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
      const isCorrectAddress = blankPage.evaluate(async () => {
        const currentAccount = await window.fuel.currentAccount();
        const wallet = await window.fuel.getWallet(currentAccount);
        return wallet.address.toString() === currentAccount;
      });
      expect(await isCorrectAddress).toBeTruthy();
    });

    await test.step('window.fuel.accounts()', async () => {
      const authorizedAccount = await getAccountByName(popupPage, 'Account 1');
      const authorizedAccount2 = await getAccountByName(popupPage, 'Account 3');
      const authorizedAccount3 = await getAccountByName(popupPage, 'Account 4');
      const accounts = await blankPage.evaluate(async () => {
        return window.fuel.accounts();
      });
      expect(accounts).toEqual([
        authorizedAccount.address,
        authorizedAccount2.address,
        authorizedAccount3.address,
      ]);
    });

    await test.step('window.fuel.currentAccount()', async () => {
      await test.step('Current authorized current Account', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 1');

        // delay to avoid the page to get the wrong currentAccount
        await delay(2000);

        const currentAccountPromise = await blankPage.evaluate(async () => {
          return window.fuel.currentAccount();
        });
        await expect(currentAccountPromise).toBe(authorizedAccount.address);
      });

      await test.step('Throw on not Authorized Account', async () => {
        await switchAccount(popupPage, 'Account 2');

        // delay to avoid the page to get the wrong currentAccount
        await delay(2000);

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

      async function approveMessageSignCheck(authorizedAccount: WalletAccount) {
        const signedMessagePromise = signMessage(
          authorizedAccount.address.toString()
        );
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
            const wallet = await window.fuel?.getWallet(
              senderAddress as string
            );

            const response = await wallet.transfer(
              receiver,
              Number(amount),
              undefined
            );
            const result = await response.waitForResult();
            return result.status;
          },
          [senderAddress, receiverAddress, String(amount)]
        );
      }

      async function approveTxCheck(senderAccount: WalletAccount) {
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

        await hasAriaLabel(approveTransactionPage, 'Confirm Transaction');
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
        const addingNetwork = addNetwork(FUEL_NETWORK.testnet);

        const addNetworkPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });

        await hasText(addNetworkPage, 'Review the Network to be added:');
        await getButtonByText(addNetworkPage, /add network/i).click();
        await expect(addingNetwork).resolves.toBeDefined();
        await popupPage.reload();
      }

      const initialNetworkAmount = isLocalNetwork ? 3 : 2;
      let networkSelector = getByAriaLabel(popupPage, 'Selected Network');
      await networkSelector.click();

      // Check initial amount of networks
      const itemsAfterRemove = popupPage.locator('[aria-label*=fuel_network]');
      const networkItemsCount = await itemsAfterRemove.count();
      expect(networkItemsCount).toEqual(initialNetworkAmount);

      // Remove network so we can test adding it again
      let testnetNetwork: Locator;
      for (let i = 0; i < networkItemsCount; i += 1) {
        const text = await itemsAfterRemove.nth(i).innerText();
        if (text.includes('Fuel Sepolia Testnet')) {
          testnetNetwork = itemsAfterRemove.nth(i);
        }
      }
      await testnetNetwork.getByLabel(/Remove/).click();
      await hasText(popupPage, /Are you sure/i);
      await getButtonByText(popupPage, /confirm/i).click();
      await expect(itemsAfterRemove).toHaveCount(initialNetworkAmount - 1);

      // Add network
      await testAddNetwork();

      // Check initial amount of networks
      await networkSelector.click();
      const itemsAfterAdd = popupPage.locator('[aria-label*=fuel_network]');
      await expect(itemsAfterAdd).toHaveCount(initialNetworkAmount);

      // Check if added network is selected
      networkSelector = getByAriaLabel(popupPage, 'Selected Network');
      await expect(networkSelector).toHaveText(/Fuel Sepolia Testnet/);
      await getByAriaLabel(popupPage, 'Close dialog').click();
    });

    // @TODO: We can enable this test once we update the @fuels/connectors version
    await test.skip('window.fuel.selectNetwork()', async () => {
      function selectNetwork(network: SelectNetworkArguments) {
        return blankPage.evaluate(
          async ([network]) => {
            return window.fuel.selectNetwork(network);
          },
          [network]
        );
      }

      async function testSelectNetwork() {
        const addingNetwork = selectNetwork({
          chainId: 0,
          url: FUEL_NETWORK.devnet,
        });

        const addNetworkPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });

        await hasText(addNetworkPage, 'Switching To:');
        await getButtonByText(addNetworkPage, /switch network/i).click();
        await expect(addingNetwork).resolves.toBeDefined();
        await popupPage.reload();
      }

      // Select network
      await testSelectNetwork();

      // Check if added network is selected
      const networkSelector = getByAriaLabel(popupPage, 'Selected Network');
      await expect(networkSelector).toHaveText(/Fuel Ignition Sepolia Devnet/);
      await getByAriaLabel(popupPage, 'Close dialog').click();
    });

    await test.step('window.fuel.on("currentAccount") to a connected account', async () => {
      // Switch to account 2
      await switchAccount(popupPage, 'Account 2');

      // delay to avoid the page to listen the event from above swithAccount wrong event
      await delay(1000);

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
      await getByAriaLabel(popupPage, 'Close dialog').click();

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
  });
});
