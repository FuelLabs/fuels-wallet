import { type Page, expect, test } from '@playwright/test';
import { Address, Provider, Wallet, bn } from 'fuels';

import { visit } from '../commons';
import { WALLET_PASSWORD } from '../mocks';
import { glideTo } from './human';

const { GENESIS_SECRET, VITE_FUEL_PROVIDER_URL } = process.env;

/** Long enough to see a moment land in the Playwright UI. */
export const HOLD_MS = 2500;

export function hold(page: Page, ms = HOLD_MS) {
  return page.waitForTimeout(ms);
}

export function wordInputs(page: Page) {
  return page.locator('[data-state] input');
}

/** Dispatches a real paste event, the way a user pasting into the first word does. */
export async function pastePhrase(page: Page, phrase: string) {
  const first = page.locator('input[aria-label="Enter word here"]').first();
  await glideTo(first);
  await first.evaluate((input, text) => {
    const data = new DataTransfer();
    data.setData('text/plain', text);
    input.dispatchEvent(
      new ClipboardEvent('paste', {
        clipboardData: data,
        bubbles: true,
        cancelable: true,
      })
    );
  }, phrase);
}

export async function acceptTerms(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Terms of use Agreement', exact: true })
  ).toBeVisible();
  await page.getByLabel('Agree with terms').click();
  await page.getByRole('button', { name: 'Next: Seed Phrase' }).click();
}

export async function setPassword(page: Page) {
  await expect(
    page.getByText(/Create password for encryption/i).first()
  ).toBeVisible();
  const password = page.getByLabel('Your Password');
  await password.fill(WALLET_PASSWORD);
  await password.press('Tab');
  const confirm = page.getByLabel('Confirm Password');
  await confirm.fill(WALLET_PASSWORD);
  await confirm.press('Tab');
  await page.getByRole('button', { name: 'Next: Finish setup' }).click();
}

export async function expectSummary(page: Page, items: string[]) {
  await expect(
    page.getByRole('heading', { name: 'Wallet created successfully' })
  ).toBeVisible({ timeout: 20_000 });
  const summary = page.getByRole('list', { name: 'Setup summary' });
  await expect(summary.locator('li')).toHaveText(items);
  await expect(page.getByLabel('All steps complete')).toBeVisible();
}

/**
 * Creates a wallet through onboarding. With `wrongWordAt`, the confirm step
 * pastes the phrase with that word swapped and fixes it by typing.
 */
export async function createWalletThroughOnboarding(
  page: Page,
  { wrongWordAt }: { wrongWordAt?: number } = {}
) {
  await test.step('Create new wallet', async () => {
    await visit(page, '/');
    await page.getByLabel('Create new wallet').click();
  });

  await test.step('Accept terms', () => acceptTerms(page));

  const words = await test.step('Back up the recovery phrase', async () => {
    const spans = page.locator('span[data-idx]');
    await expect(spans).toHaveCount(12);
    const phrase = (await spans.allTextContents()).map((w) => w.trim());
    await page.getByLabel('Confirm Saved').click();
    await page.getByRole('button', { name: 'Next: Confirm phrase' }).click();
    return phrase;
  });

  await test.step('Confirm the phrase', async () => {
    await expect(page.getByText('Confirm phrase').first()).toBeVisible();
    const next = page.getByRole('button', { name: 'Next: Your password' });

    if (wrongWordAt === undefined) {
      await pastePhrase(page, words.join(' '));
      await expect(page.getByText('12/12')).toBeVisible();
      await expect(next).toBeEnabled();
      await next.click();
      return;
    }

    const wrong = words[wrongWordAt] === 'zoo' ? 'abandon' : 'zoo';
    const pasted = words.map((w, i) => (i === wrongWordAt ? wrong : w));

    await test.step(`Paste with word ${wrongWordAt + 1} wrong`, async () => {
      await pastePhrase(page, pasted.join(' '));
      const inputs = wordInputs(page);
      await expect(inputs).toHaveCount(12);
      await expect(inputs.nth(wrongWordAt)).toHaveAttribute(
        'aria-invalid',
        'true'
      );
      await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(1);
      await expect(page.getByText('11/12')).toBeVisible();
      await expect(next).toBeDisabled();
      await hold(page);
    });

    await test.step('Fix the word by typing', async () => {
      const input = wordInputs(page).nth(wrongWordAt);
      await input.fill('');
      await input.pressSequentially(words[wrongWordAt], { delay: 80 });
      await input.blur();
      await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(0);
      await expect(page.getByText('12/12')).toBeVisible();
      await expect(next).toBeEnabled();
      await hold(page);
      await next.click();
    });
  });

  await test.step('Set the password', () => setPassword(page));

  return words;
}

export function genesisWallet() {
  const provider = new Provider(VITE_FUEL_PROVIDER_URL as string);
  return Wallet.fromPrivateKey(GENESIS_SECRET as string, provider);
}

/** One base-asset coin from the genesis wallet. */
export async function seedBaseAsset(address: string, amount = bn(1_000_000)) {
  const genesis = genesisWallet();
  const baseAssetId = await genesis.provider.getBaseAssetId();
  const tx = await genesis.transfer(
    Address.fromString(address),
    amount,
    baseAssetId
  );
  await tx.waitForResult();
}

/** Many small base-asset coins, packed into as few transactions as the chain allows. */
export async function seedManyCoins(
  address: string,
  count: number,
  amount = bn(1_000_000)
) {
  const genesis = genesisWallet();
  const { provider } = genesis;
  const baseAssetId = await provider.getBaseAssetId();
  const chain = await provider.getChain();
  const maxOutputs = chain.consensusParameters.txParameters.maxOutputs;
  const perTx = Math.min(200, maxOutputs.toNumber() - 2);
  const destination = Address.fromString(address);

  let left = count;
  while (left > 0) {
    const size = Math.min(perTx, left);
    const tx = await genesis.batchTransfer(
      Array.from({ length: size }, () => ({
        destination,
        amount,
        assetId: baseAssetId,
      }))
    );
    await tx.waitForResult();
    left -= size;
  }
}

export async function maxInputs() {
  const chain = await genesisWallet().provider.getChain();
  return chain.consensusParameters.txParameters.maxInputs.toNumber();
}

type GetStartedState = {
  secured?: boolean;
  funded?: boolean;
  connected?: boolean;
  dismissed?: boolean;
  emptyKeys?: string[];
};

export function readGetStarted(page: Page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem('fuel_getStarted');
    return raw ? (JSON.parse(raw) as GetStartedState) : null;
  });
}

/** New wallets start on mainnet; point this one at the local node and reopen. */
export async function selectLocalNetwork(page: Page) {
  await page.evaluate(async (url) => {
    const db = window.fuelDB;
    await db.networks.toCollection().modify({ isSelected: false });
    await db.networks.add({
      id: 'local-moments',
      name: 'Local',
      url,
      chainId: 0,
      isSelected: true,
    });
  }, VITE_FUEL_PROVIDER_URL as string);
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Assets' })).toBeVisible();
  await page.waitForFunction(() => Boolean(window.fuelDB));
}
