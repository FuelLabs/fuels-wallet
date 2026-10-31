import { expect, test } from '@playwright/test';
import { Mnemonic } from 'fuels';

import { visit } from '../commons';
import {
  acceptTerms,
  createWalletThroughOnboarding,
  expectSummary,
  hold,
  pastePhrase,
  setPassword,
  wordInputs,
} from './helpers';

test.describe('Onboarding moments', () => {
  test('create: per-word checks, tally and setup summary', async ({ page }) => {
    await createWalletThroughOnboarding(page, { wrongWordAt: 4 });

    await test.step('Wallet created: setup summary', async () => {
      await expectSummary(page, [
        'Recovery phrase backed up',
        'Recovery phrase confirmed',
        'Password set',
        'Account ready',
      ]);
      await expect(page.getByText('Account 1').first()).toBeVisible();
      await hold(page, 2500);
    });

    await test.step('Go to wallet', async () => {
      await page.getByRole('button', { name: 'Go to wallet' }).click();
      await expect(page.getByRole('tab', { name: 'Assets' })).toBeVisible();
      await hold(page);
    });
  });

  test('import: paste a valid phrase and see the import summary', async ({
    page,
  }) => {
    const phrase = Mnemonic.generate(16);

    await test.step('Import seed phrase', async () => {
      await visit(page, '/');
      await page.getByLabel('Import seed phrase').click();
    });

    await test.step('Accept terms', () => acceptTerms(page));

    await test.step('Paste a valid 12-word phrase', async () => {
      await expect(
        page.getByRole('heading', { name: 'Recover wallet' })
      ).toBeVisible();
      await pastePhrase(page, phrase);
      const inputs = wordInputs(page);
      await expect(inputs).toHaveCount(12);
      await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(0);
      for (const [i, word] of phrase.split(' ').entries()) {
        await expect(inputs.nth(i)).toHaveValue(word);
        await expect(inputs.nth(i)).not.toHaveAttribute('aria-invalid');
      }
      await expect(page.getByText('12/12')).toBeVisible();
      const next = page.getByRole('button', { name: 'Next: Your password' });
      await expect(next).toBeEnabled();
      await hold(page);
      await next.click();
    });

    await test.step('Set the password', () => setPassword(page));

    await test.step('Wallet imported: setup summary', async () => {
      await expectSummary(page, [
        'Recovery phrase imported',
        'Password set',
        'Account ready',
      ]);
      await hold(page, 2500);
      await page.getByRole('button', { name: 'Go to wallet' }).click();
      await expect(page.getByRole('tab', { name: 'Assets' })).toBeVisible();
    });
  });
});
