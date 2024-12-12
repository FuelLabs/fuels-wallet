import { expect, test } from '@playwright/test';
import { hasText, waitAriaLabel } from '../commons';

test.describe('Check assets', () => {
  test('should show valid asset values', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await test.step('Import wallet', async () => {
      await page.getByRole('heading', { name: 'Import seed phrase' }).click();
      await page.getByText('I Agree to the Terms Of Use').click();
      await page.getByRole('button', { name: 'Next: Seed Phrase' }).click();
      const mnemonic = process.env.READONLY_TESTNET_ASSETS_VIEW;

      const words = mnemonic.split(' ');
      for (const [index, word] of words.entries()) {
        const locator = page.locator('div').filter({
          hasText: new RegExp(`^${index + 1}$`),
        });
        console.log(`Filling word ${index + 1}: ${word}`);
        const input = locator.getByLabel('Type your text');
        await input.fill(word);
        console.log(`Filled word ${index + 1}`);
      }

      await page.getByRole('button', { name: 'Next: Your password' }).click();
      await page.getByPlaceholder('Type your password').fill('qwe123QWE!@#');
      await page.getByPlaceholder('Confirm your password').fill('qwe123QWE!@#');
      await page.getByRole('button', { name: 'Next: Finish set-up' }).click();
      await hasText(page, /Wallet created successfully/i);
      await page.goto('http://localhost:3000/#/wallet');
      await waitAriaLabel(page, 'Account 1 selected');
      await page.getByLabel('Selected Network').click();
      await page.getByText('Fuel Sepolia Testnet').click();
      await waitAriaLabel(page, 'Account 1 selected');
      expect(
        await page.getByText('0.002000', { exact: true }).isVisible()
      ).toBeTruthy();
      expect(
        await page.getByText('USDCIcon AlertTriangle').isVisible()
      ).toBeTruthy();
      expect(await page.getByText('1 SCAM').isVisible()).toBeTruthy();
      await page.close();
    });
  });
});
