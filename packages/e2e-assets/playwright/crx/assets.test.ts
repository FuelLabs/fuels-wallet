import { type Page, expect, test } from '@playwright/test';
import { hasText, waitAriaLabel } from '../commons';

test.describe('Check assets', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
    });

    await test.step('Import wallet', async () => {
      await page.getByRole('heading', { name: 'Import seed phrase' }).click();
      await page.getByText('I Agree to the Terms Of Use').click();
      await page.getByRole('button', { name: 'Next: Seed Phrase' }).click();
      const mnemonic = process.env.READONLY_TESTNET_ASSETS_VIEW;
      console.log(`Importing wallet with mnemonic: ${mnemonic}`);

      await page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
      }, mnemonic);

      // const words = mnemonic.split(' ');
      // for (const [index, word] of words.entries()) {
      //   console.log(`Filling word ${index + 1}: ${word}`);
      //   const locator = page.locator('div').filter({
      //     hasText: new RegExp(`^${index + 1}$`),
      //   });
      //   const input = locator.getByLabel('Type your text');
      //   await input.fill(word);
      //   console.log(`Filled word ${index + 1}`);
      // }

      await page.getByRole('button', { name: 'Paste seed phrase' }).click();

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
    });
  });

  test.describe.configure({ mode: 'parallel' });
  test('should show valid asset value 0.002000', async () => {
    expect(
      await page.getByText('0.002000', { exact: true }).isVisible()
    ).toBeTruthy();
  });

  test('should show USDCIcon AlertTriangle', async () => {
    expect(
      await page.getByText('USDCIcon AlertTriangle').isVisible()
    ).toBeTruthy();
  });

  test('should show 1 SCAM', async () => {
    expect(await page.getByText('1 SCAM').isVisible()).toBeTruthy();
  });
});
