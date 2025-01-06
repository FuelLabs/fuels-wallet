import type { NetworkData, Account as WalletAccount } from '@fuel-wallet/types';
import { type Locator, expect } from '@playwright/test';

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
  CUSTOM_ASSET_INPUT_3,
  CUSTOM_ASSET_INPUT_4,
  FUEL_LOCAL_NETWORK,
  PRIVATE_KEY,
  mockData,
} from '../mocks';

import {
  Address,
  type Asset,
  CHAIN_IDS,
  type NetworkFuel,
  Provider,
  Signer,
  Wallet,
  bn,
  hashMessage,
} from 'fuels';
import {
  getAccountByName,
  getWalletAccounts,
  hideAccount,
  switchAccount,
  test,
  waitAccountPage,
  waitWalletToLoad,
} from './utils';

const NETWORK_IGNITION = {
  id: '1',
  name: 'Ignition',
  url: 'https://mainnet.fuel.network/v1/graphql',
  chainId: CHAIN_IDS.fuel.mainnet,
  explorerUrl: 'https://app.fuel.network',
  bridgeUrl: 'https://app.fuel.network/bridge',
  isSelected: true,
};
const NETWORK_TESTNET = {
  id: '2',
  name: 'Fuel Sepolia Testnet',
  url: 'https://testnet.fuel.network/v1/graphql',
  chainId: CHAIN_IDS.fuel.testnet,
  explorerUrl: 'https://app-testnet.fuel.network',
  faucetUrl: 'https://faucet-testnet.fuel.network/',
  bridgeUrl: 'https://app-testnet.fuel.network/bridge',
  isSelected: false,
};
const NETWORK_DEVNET = {
  id: '3',
  name: 'Fuel Sepolia Devnet',
  url: 'https://devnet.fuel.network/v1/graphql',
  chainId: CHAIN_IDS.fuel.devnet,
  explorerUrl: 'https://app-devnet.fuel.network',
  faucetUrl: 'https://faucet-devnet.fuel.network/',
  isSelected: false,
};

const DEFAULT_NETWORKS: Array<
  NetworkData & { faucetUrl?: string; bridgeUrl?: string; hidden?: boolean }
> = [NETWORK_IGNITION, NETWORK_TESTNET, NETWORK_DEVNET];

const WALLET_PASSWORD = 'Qwe123456$';

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
    const provider = await Provider.create(process.env.VITE_FUEL_PROVIDER_URL);
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

    await test.step('Should return current version of Wallet', async () => {
      const version = await blankPage.evaluate(async () => {
        async function waitForConnection(depth = 0) {
          if (depth > 20) {
            throw new Error('Account never connected');
          }
          await new Promise((resolve) => {
            setTimeout(async () => {
              const currentConnectors = await window.fuel.connectors();
              if (currentConnectors[0].installed) {
                resolve(true);
              } else {
                await waitForConnection(depth + 1);
              }
              resolve(true);
            }, 500);
          });
        }
        await waitForConnection();
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

    await test.step('Should mock initial data', async () => {
      const page = await context.newPage();
      await mockData(page, 1, DEFAULT_NETWORKS);
      await popupPage.reload();
      await waitWalletToLoad(popupPage);
      await page.close();
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
        async function waitForConnection(depth = 0) {
          if (depth > 20) {
            throw new Error('Account never connected');
          }
          await new Promise((resolve) => {
            setTimeout(async () => {
              const currentConnectors = await window.fuel.currentConnector();
              if (currentConnectors.installed) {
                resolve(true);
              } else {
                await waitForConnection(depth + 1);
              }
              resolve(true);
            }, 500);
          });
        }
        // needs to select the connector after refresh
        await window.fuel.selectConnector('Fuel Wallet Development');
        await window.fuel.hasConnector();
        await waitForConnection();
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

      await expect
        .poll(
          async () => {
            return await hasText(connectPage, /connect/i).catch(() => false);
          },
          { timeout: 10000 }
        )
        .toBeTruthy();

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

    await test.step('window.fuel.selectNetwork() for selecting a network', async () => {
      async function testSelectNetwork(network: NetworkData) {
        const selectingNetwork = blankPage.evaluate(
          async ([network]) => {
            return window.fuel.selectNetwork(network);
          },
          [network]
        );
        const selectNetworkPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });
        await hasText(selectNetworkPage, 'Switching To');
        await hasText(selectNetworkPage, network.name);

        await getButtonByText(selectNetworkPage, /switch network/i).click();
        await expect(selectingNetwork).resolves.toBeDefined();
      }

      await testSelectNetwork(NETWORK_TESTNET);
      await popupPage.waitForTimeout(2000);
      await testSelectNetwork(NETWORK_DEVNET);
      await popupPage.waitForTimeout(2000);
      await testSelectNetwork(NETWORK_IGNITION);
      await popupPage.waitForTimeout(2000);
    });

    await test.step('window.fuel.selectNetwork() for adding a network', async () => {
      async function addLocalNetwork() {
        const selectingNetwork = blankPage.evaluate(
          async ([network]) => {
            return window.fuel.selectNetwork(network);
          },
          [FUEL_LOCAL_NETWORK]
        );

        const selectNetworkPage = await context.waitForEvent('page', {
          predicate: (page) => page.url().includes(extensionId),
        });

        await hasText(selectNetworkPage, 'Review the Network to be added:');
        await hasText(selectNetworkPage, 'Local network');
        await getButtonByText(selectNetworkPage, /add network/i).click();
        await expect(selectingNetwork).resolves.toBeDefined();
        await popupPage.reload();
        await waitWalletToLoad(popupPage);
      }

      const initialNetworkAmount = 3;
      const networkSelectorBeforeAdd = getByAriaLabel(
        popupPage,
        'Selected Network'
      );
      await networkSelectorBeforeAdd.click();

      // Check initial amount of networks
      const itemBeforeAdd = popupPage.locator('[aria-label*=fuel_network]');
      const networkItemsCountBeforeAdd = await itemBeforeAdd.count();
      expect(networkItemsCountBeforeAdd).toEqual(initialNetworkAmount);

      await addLocalNetwork();

      const networkSelectorAfterAdd = getByAriaLabel(
        popupPage,
        'Selected Network'
      );
      await networkSelectorAfterAdd.click();

      const itemAfterAdd = popupPage.locator('[aria-label*=fuel_network]');
      const networkItemsCountAfterAdd = await itemAfterAdd.count();
      expect(networkItemsCountAfterAdd).toEqual(initialNetworkAmount + 1);

      // Remove network so we can test adding it again
      let testnetNetwork: Locator;
      for (let i = 0; i < networkItemsCountAfterAdd; i += 1) {
        const text = await itemAfterAdd.nth(i).innerText();
        if (text.includes('Local')) {
          testnetNetwork = itemAfterAdd.nth(i);
        }
      }
      await testnetNetwork.getByLabel(/Remove/).click();
      await hasText(popupPage, /Are you sure/i);
      await getButtonByText(popupPage, /confirm/i).click();
      const itemsAfterRemove = popupPage.locator('[aria-label*=fuel_network]');
      await expect(itemsAfterRemove).toHaveCount(initialNetworkAmount);

      // Add network
      await addLocalNetwork();

      // Check initial amount of networks
      const networkSelectorAfterFinished = getByAriaLabel(
        popupPage,
        'Selected Network'
      );
      await networkSelectorAfterFinished.click();

      const itemsAfterAdd = popupPage.locator('[aria-label*=fuel_network]');
      await expect(itemsAfterAdd).toHaveCount(initialNetworkAmount + 1);

      // // Check if added network is selected
      await expect(networkSelectorAfterFinished).toHaveText(/Local/);
      await getByAriaLabel(popupPage, 'Close dialog').click();
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
    await test.step('wait for initial connection', async () => {
      await expect
        .poll(
          async () => {
            return blankPage.evaluate(async () => {
              return window.fuel.isConnected();
            });
          },
          { timeout: 5000 }
        )
        .toBeTruthy();
    });

    await test.step('window.fuel.on("connection") disconnection', async () => {
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
      const currentAccount = await blankPage.evaluate(async () => {
        return window.fuel.currentAccount();
      });
      const walletAccount = await blankPage.evaluate(
        async ([currentAccount]) => {
          const wallet = await window.fuel.getWallet(currentAccount);
          return wallet.address.toString();
        },
        [currentAccount]
      );
      expect(Address.fromString(currentAccount).toString()).toEqual(
        walletAccount
      );
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
      let account1Address: string;
      await test.step('Current authorized current Account', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 1');
        account1Address = authorizedAccount.address;
        // delay to avoid the page to get the wrong currentAccount
        await delay(2000);

        const currentAccountPromise = await blankPage.evaluate(async () => {
          return window.fuel.currentAccount();
        });

        await expect(currentAccountPromise).toBe(authorizedAccount.address);
      });

      await test.step('Changing to not connected wallet should keep Account 1 as connected', async () => {
        await switchAccount(popupPage, 'Account 2');

        const currentAccountPromise = await blankPage.evaluate(async () => {
          return window.fuel.currentAccount();
        });

        expect(currentAccountPromise).toBe(account1Address);
      });

      await test.step('Changing to Account 3 show work as authorized account', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 3');
        // delay to avoid the page to get the wrong currentAccount
        await delay(2000);

        const currentAccountPromise = await blankPage.evaluate(async () => {
          return window.fuel.currentAccount();
        });
        await expect(currentAccountPromise).toBe(authorizedAccount.address);
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
        const AMOUNT_TRANSFER = 100;
        const receiverWallet = Wallet.generate({
          provider,
        });
        bn(100_000_000);
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
        await expect
          .poll(
            async () => {
              const element = await waitAriaLabel(
                approveTransactionPage,
                'amount-container'
              );
              const content = await element.textContent();
              return /0\.0000001\s*ETH/i.test(content);
            },
            { timeout: 15000 }
          )
          .toBeTruthy();
        await waitAriaLabel(
          approveTransactionPage,
          senderAccount.address.toString()
        );

        await hasAriaLabel(approveTransactionPage, 'Confirm Transaction');
        await getButtonByText(approveTransactionPage, /Submit/i).click();

        await expect(transferStatus).resolves.toBe('success');
        const balance = await receiverWallet.getBalance();
        expect(balance.toNumber()).toBe(AMOUNT_TRANSFER);
      }

      await test.step('Seed initial funds using authorized Account', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 1');

        await seedWallet(authorizedAccount.address, bn(100_000_000));
        await hasText(popupPage, /0\.100/i);
      });

      await test.step('Send transfer using authorized Account', async () => {
        const authorizedAccount = await switchAccount(popupPage, 'Account 1');
        // Add some coins to the account
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
      expect(assets.length).toBeGreaterThan(0);
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

      const addingAsset = addAssets([
        CUSTOM_ASSET_INPUT_3,
        CUSTOM_ASSET_INPUT_2,
      ]);

      const addAssetPage = await context.waitForEvent('page', {
        predicate: (page) => page.url().includes(extensionId),
      });
      await hasText(addAssetPage, 'Review the Assets to be added:');
      await getButtonByText(addAssetPage, /add assets/i).click();
      await expect(addingAsset).resolves.toBeDefined();
    });

    await test.step('show throw error when adding an existing asset', async () => {
      function addAssets(assets: Asset[]) {
        return blankPage.evaluate(
          async ([asset]) => {
            return window.fuel.addAssets(asset);
          },
          [assets]
        );
      }

      expect(() => addAssets([CUSTOM_ASSET_INPUT])).rejects.toThrow();
    });

    await test.step('show throw error when first asset is new but second is duplicate ', async () => {
      function addAssets(assets: Asset[]) {
        return blankPage.evaluate(
          async ([asset]) => {
            return window.fuel.addAssets(asset);
          },
          [assets]
        );
      }

      expect(() =>
        addAssets([CUSTOM_ASSET_INPUT_4, CUSTOM_ASSET_INPUT_4])
      ).rejects.toThrow();
    });

    await test.step('show validate custom assetIds using root assetId', async () => {
      function addAssets(assets: Asset[]) {
        return blankPage.evaluate(
          async ([asset]) => {
            return window.fuel.addAssets(asset);
          },
          [assets]
        );
      }

      expect(() =>
        addAssets([
          {
            name: `${CUSTOM_ASSET_INPUT.name}x`,
            symbol: `${CUSTOM_ASSET_INPUT.symbol}x`,
            icon: CUSTOM_ASSET_INPUT.icon,
            assetId: (CUSTOM_ASSET_INPUT.networks[0] as NetworkFuel).assetId,
            networks: [],
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          } as any,
        ])
      ).rejects.toThrow();
    });

    await test.step('window.fuel.on("currentAccount") to a connected account', async () => {
      // Switch to account 2
      await switchAccount(popupPage, 'Account 2');

      // delay to avoid the page to listen the event from above swithAccount wrong event
      await delay(1000);

      // Watch for result
      const currentAccountEventResult = blankPage.evaluate(() => {
        return new Promise((resolve) => {
          window.fuel.on(window.fuel.events.currentAccount, (account) => {
            resolve(account);
          });
        });
      });
      // Switch to account 1
      const currentAccount = await switchAccount(popupPage, 'Account 1');

      // Check result
      expect(await currentAccountEventResult).toEqual(currentAccount.address);
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
