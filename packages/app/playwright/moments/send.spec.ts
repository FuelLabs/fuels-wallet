import type { Page } from '@playwright/test';
import { expect, test } from './human';
import { Provider, Wallet, bn } from 'fuels';

import { reload, seedWallet, visit } from '../commons';
import { mockData } from '../mocks';
import { hold } from './helpers';

function randomAddress() {
  const provider = new Provider(process.env.VITE_FUEL_PROVIDER_URL as string);
  return Wallet.generate({ provider }).address.toString();
}

async function openSend(page: Page) {
  await visit(page, '/send');
  await page.getByRole('combobox', { name: 'Select Asset' }).click();
  await page.getByText('Ethereum').first().click();
}

async function fillAmount(page: Page, amount: string) {
  const input = page.locator('input[name="amount"]');
  // Same settle as SendTransaction.test.ts before typing the amount.
  await input.focus();
  await page.waitForTimeout(1000);
  await input.fill(amount);
}

async function fillRecipient(page: Page, address: string) {
  const input = page.locator('input[name="address"]');
  await input.fill('');
  await input.pressSequentially(address, { delay: 5 });
}

test.describe('Send moments', () => {
  test('recipient history: own account, first transfer, sent before', async ({
    page,
  }) => {
    const { accounts } = await mockData(page, 2);
    await seedWallet(accounts[0].address, bn(100_000_000));
    await reload(page);
    const history = page.getByLabel('Recipient history');
    const stranger = randomAddress();

    await test.step('Type your own second account', async () => {
      await openSend(page);
      await fillRecipient(page, accounts[1].address);
      await expect(history).toHaveText(/Your account: Account 2/i);
      await hold(page);
    });

    await test.step('Type a new address', async () => {
      await fillRecipient(page, stranger);
      await expect(history).toHaveText(/First transfer to this address/i, {
        timeout: 20_000,
      });
      await hold(page);
    });

    await test.step('Send to it once', async () => {
      await fillAmount(page, '0.001');
      const review = page.getByRole('button', { name: 'Review' });
      await expect(review).toBeEnabled({ timeout: 20_000 });
      await review.click();
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Success').first()).toBeVisible({
        timeout: 30_000,
      });
    });

    await test.step('Same address: sent before', async () => {
      await openSend(page);
      await fillRecipient(page, stranger);
      await expect(history).toHaveText(/Sent before, 1 time$/i, {
        timeout: 30_000,
      });
      await hold(page, 3500);
    });
  });

  test('fee feedback: Fast shows the priority tip, Regular hides it', async ({
    page,
  }) => {
    const { accounts } = await mockData(page);
    await seedWallet(accounts[0].address, bn(100_000_000));
    await reload(page);
    const tip = page.getByLabel('Priority tip');

    await test.step('Fill recipient and amount', async () => {
      await openSend(page);
      await fillRecipient(page, randomAddress());
      await fillAmount(page, '0.001');
      await expect(page.getByRole('radio', { name: 'Fast' })).toBeVisible({
        timeout: 20_000,
      });
      await expect(tip).toBeHidden();
      await hold(page);
    });

    await test.step('Pick Fast', async () => {
      await page.getByRole('radio', { name: 'Fast' }).click();
      await expect(tip).toBeVisible();
      await expect(tip).toHaveText(/Priority tip: \+.+ ETH/);
      await hold(page);
    });

    await test.step('Pick Regular', async () => {
      await page.getByRole('radio', { name: 'Regular' }).click();
      await expect(tip).toBeHidden();
      await hold(page);
    });
  });
});
