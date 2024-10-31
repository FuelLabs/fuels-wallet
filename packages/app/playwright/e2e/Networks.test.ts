import type { Browser, Page } from '@playwright/test';
import test, { chromium, expect } from '@playwright/test';

import { CHAIN_IDS } from 'fuels';
import {
  getButtonByText,
  getByAriaLabel,
  getInputByName,
  hasText,
  reload,
  visit,
} from '../commons';
import { mockData } from '../mocks';

const { VITE_FUEL_PROVIDER_URL } = process.env;

test.describe('Networks', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  test.beforeEach(async () => {
    await visit(page, '/');
    await mockData(page);
  });

  test('should be able to see network list', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, /Local/);
    await hasText(page, /Another/);
  });

  test('should be able to select a network', async () => {
    await visit(page, '/wallet');
    const networkSelector = getByAriaLabel(page, 'Selected Network');
    await expect(networkSelector).toHaveText(/Local/);
    await networkSelector.click();
    await hasText(page, /Another/i);
    const network1 = getByAriaLabel(page, 'fuel_network-item-1');
    await expect(network1).toHaveAttribute('data-active', 'true');
    const anotherNetwork = getByAriaLabel(page, 'fuel_network-item-2');
    await anotherNetwork.click();
    await page.waitForTimeout(1000);
    await visit(page, '/wallet');
    const selector = getByAriaLabel(page, 'Selected Network');
    await expect(selector).toHaveText(/Another/i);
  });

  test('should display correct network data while editing', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    const networkItems = page.locator('[aria-label^="fuel_network-item-"]');
    for (const networkItem of await networkItems.all()) {
      const networkName = await networkItem
        .locator('[aria-label="Network name"]')
        .textContent();
      await networkItem.locator('[aria-label="Update"]').click();
      await hasText(page, /Update network/i);
      const inputName = getInputByName(page, 'name');
      await expect(inputName).toHaveValue(networkName.trim());
      getByAriaLabel(page, 'Cancel network update').click();
      await hasText(page, /Networks/i);
    }
  });

  test('should be able to update a network', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, /Networks/i);
    await getByAriaLabel(page, 'Update').first().click();
    await hasText(page, /Update network/i);
    const urlInput = getInputByName(page, 'url');
    await expect(urlInput).toHaveValue(VITE_FUEL_PROVIDER_URL);
    const inputName = getInputByName(page, 'name');
    await expect(inputName).toBeFocused();
    await inputName.fill('Local 1');
    const update = getByAriaLabel(page, 'Update network');
    expect(update).toBeEnabled();
    await update.click();
    await hasText(page, /Local 1/);
  });

  test('should be able to remove a network', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    const items = page.locator('[aria-label*=fuel_network]');
    await expect(items).toHaveCount(2);
    await getByAriaLabel(page, 'Remove').first().click();
    await hasText(page, /Are you sure/i);
    await getButtonByText(page, /confirm/i).click();
    await expect(items).toHaveCount(1);
    await expect(items.first()).toHaveAttribute('data-active', 'true');
  });

  test('should NOT be able to add a new network with wrong chain ID', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, /Add new network/i);
    await getByAriaLabel(page, 'Add network').click();
    const buttonCreate = getButtonByText(page, /add/i);
    await expect(buttonCreate).toBeDisabled();
    const urlInput = getInputByName(page, 'url');
    await expect(urlInput).toBeFocused();
    await urlInput.fill('https://testnet.fuel.network/v1/graphql');
    const chainIdInput = getInputByName(page, 'chainId');
    await chainIdInput.fill('9999');
    await hasText(page, /Test connection/i);
    await expect
      .poll(
        async () =>
          await getByAriaLabel(page, 'Test connection')
            .isEnabled()
            .catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
    await getByAriaLabel(page, 'Test connection').click();
    await expect
      .poll(
        async () =>
          await hasText(
            page,
            /Informed Chain ID does not match the network Chain ID./i
          ).catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
  });

  test('should be able to add a new network with a manual chain ID', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, /Add new network/i);
    await getByAriaLabel(page, 'Add network').click();
    const buttonCreate = getButtonByText(page, /add/i);
    await expect(buttonCreate).toBeDisabled();
    const urlInput = getInputByName(page, 'url');
    await expect(urlInput).toBeFocused();
    await urlInput.fill('https://testnet.fuel.network/v1/graphql');
    const chainIdInput = getInputByName(page, 'chainId');
    await chainIdInput.fill(CHAIN_IDS.fuel.testnet.toString());
    await hasText(page, /Test connection/i);
    await expect
      .poll(
        async () =>
          await getByAriaLabel(page, 'Test connection')
            .isEnabled()
            .catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
    await getByAriaLabel(page, 'Test connection').click();
    await expect
      .poll(
        async () =>
          await hasText(page, /Fuel Sepolia Testnet/i)
            .then(() => true)
            .catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
    console.log('asd waiting for button to be enabled');
    await expect
      .poll(async () => await buttonCreate.isEnabled(), {
        timeout: 15000,
      })
      .toBeTruthy();
    console.log('asd button is enabled');
    await buttonCreate.click();
    // Wait for popup to close
    await expect
      .poll(
        async () => {
          return await hasText(page, /Add network/i).catch(() => false);
        },
        {
          timeout: 15000,
        }
      )
      .toBeFalsy();
    await expect
      .poll(
        async () => {
          await reload(page);
          return await hasText(page, /Fuel Sepolia Testnet/i).catch(
            () => false
          );
        },
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
  });

  test('should be able to add a new network with wrong chainId then correct chainId', async () => {
    await visit(page, '/wallet');
    await getByAriaLabel(page, 'Selected Network').click();
    await hasText(page, /Add new network/i);
    await getByAriaLabel(page, 'Add network').click();
    const buttonCreate = getButtonByText(page, /add/i);
    await expect(buttonCreate).toBeDisabled();
    const urlInput = getInputByName(page, 'url');
    await expect(urlInput).toBeFocused();
    await urlInput.fill('https://mainnet.fuel.network/v1/graphql');
    const chainIdInput = getInputByName(page, 'chainId');
    await chainIdInput.fill('999999');
    await hasText(page, /Test connection/i);
    await expect
      .poll(
        async () =>
          await getByAriaLabel(page, 'Test connection')
            .isEnabled()
            .catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
    await getByAriaLabel(page, 'Test connection').click();
    await expect
      .poll(
        async () =>
          await hasText(
            page,
            /Informed Chain ID does not match the network Chain ID./i
          ).catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
    await urlInput.fill('https://testnet.fuel.network/v1/graphql');
    await chainIdInput.fill(CHAIN_IDS.fuel.testnet.toString());
    await hasText(page, /Test connection/i);
    await expect
      .poll(
        async () =>
          await getByAriaLabel(page, 'Test connection')
            .isEnabled()
            .catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
    await getByAriaLabel(page, 'Test connection').click();
    await expect
      .poll(
        async () =>
          await hasText(page, /Fuel Sepolia Testnet/i)
            .then(() => true)
            .catch(() => false),
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
    console.log('asd waiting for button to be enabled');
    await expect
      .poll(async () => await buttonCreate.isEnabled(), {
        timeout: 15000,
      })
      .toBeTruthy();
    console.log('asd button is enabled');
    await buttonCreate.click();
    await expect
      .poll(
        async () => {
          return await hasText(page, /Add network/i).catch(() => false);
        },
        {
          timeout: 15000,
        }
      )
      .toBeFalsy();
    // Wait for popup to close
    await expect
      .poll(
        async () => {
          await reload(page);
          return await hasText(page, /Fuel Sepolia Testnet/i).catch(
            () => false
          );
        },
        {
          timeout: 15000,
        }
      )
      .toBeTruthy();
  });
});
