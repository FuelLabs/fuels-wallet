import { type Browser, type Page, expect, test } from '@playwright/test';
import { hasText, waitAriaLabel } from '../commons';

const loadWallet = async (page: Page, _browser: Browser) => {
  await page.goto('http://localhost:3000', {
    waitUntil: 'domcontentloaded',
  });

  await test.step('Import wallet', async () => {
    await page.getByRole('heading', { name: 'Import seed phrase' }).click();
    await page.getByText('I Agree to the Terms Of Use').click();
    await page.getByRole('button', { name: 'Next: Seed Phrase' }).click();
    const mnemonic = process.env.READONLY_TESTNET_ASSETS_VIEW;

    await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, mnemonic);

    await page.waitForTimeout(1000);
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
};

test.describe('Check assets', () => {
  test.describe.configure({ mode: 'parallel' });
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loadWallet(page, browser);
  });

  test('should show valid asset value 0.002000', async () => {
    await expect
      .poll(
        async () =>
          await page
            .getByLabel('ETH token balance', { exact: true })
            .isVisible(),
        { timeout: 10000 }
      )
      .toBeTruthy();
    await expect(
      page.getByLabel('ETH token balance', { exact: true })
    ).toContainText('0.002000 ETH');
  });

  test('should show USDCIcon AlertTriangle', async () => {
    await expect
      .poll(
        async () => await page.getByText('USDCIcon AlertTriangle').isVisible(),
        { timeout: 10000 }
      )
      .toBeTruthy();
  });

  test('should show 1 SCAM NFT', async () => {
    await expect
      .poll(async () => await page.getByText('1 SCAM').isVisible(), {
        timeout: 10000,
      })
      .toBeTruthy();
  });

  // Verified assets should never show the (Add) button
  test('should not show (Add) button for verified assets', async () => {
    await expect
      .poll(
        async () =>
          await page.getByRole('button', { name: '(Add)' }).isVisible(),
        { timeout: 10000 }
      )
      .toBeFalsy();
  });

  // Verified assets will never be inside of "Hidden assets" part
  test('should not show verified assets in hidden assets', async () => {
    // get all h6 text from div.fuel_CardList as an array, and then click Show unknown assets button, and then check if the array added a new element with a name other than Unknown
    let h6Texts: string[] = [];
    await expect
      .poll(
        async () => {
          h6Texts = await page.$$eval('div.fuel_CardList h6', (els) =>
            els.map((el) => el.textContent)
          );
          return h6Texts;
        },
        { timeout: 10000 }
      )
      .toBeTruthy();

    await page.getByLabel('Show unknown assets').click();

    let h6TextsAfter: string[] = [];

    await expect
      .poll(
        async () => {
          h6TextsAfter = await page.$$eval('div.fuel_CardList h6', (els) =>
            els.map((el) => el.textContent)
          );
          return h6TextsAfter.length;
        },
        { timeout: 10000 }
      )
      .toBeGreaterThan(h6Texts.length);

    for (const el of h6Texts) {
      expect(el.includes('(Add)')).toBeFalsy();
    }
    // removing all elements from h6TextsAfter that are in h6Texts
    const diff = h6TextsAfter.filter((el) => !h6Texts.includes(el));
    // all elements in diff should include Unknown
    for (const el of diff) {
      expect(el.includes('Unknown')).toBeTruthy();
    }
  });
});

test.describe('Check assets', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loadWallet(page, browser);
  });

  test('Should add unknown asset', async () => {
    await expect
      .poll(async () => page.getByLabel('Show unknown assets'), {
        timeout: 10000,
      })
      .toBeDefined();
    await page.getByLabel('Show unknown assets').click();
    await expect
      .poll(async () => page.getByRole('button', { name: '(Add)' }).nth(1), {
        timeout: 10000,
      })
      .toBeDefined();
    await page.getByRole('button', { name: '(Add)' }).nth(1).click();

    await expect
      .poll(async () => await page.getByText('Token 2'), {
        timeout: 10000,
      })
      .toBeDefined();
    await page.getByPlaceholder('Asset name').fill('Token 2');
    await page.getByPlaceholder('Asset symbol').fill('TKN2');
    await page.getByLabel('Save Asset').click();
    await page.waitForTimeout(1000);

    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect
      .poll(
        async () => {
          return page.getByLabel('Account 1 selected').isVisible();
        },
        { timeout: 10000 }
      )
      .toBeTruthy();

    await expect
      .poll(
        async () => {
          const text = await page.getByText('1 TKN2');
          return text.isVisible();
        },
        { timeout: 10000 }
      )
      .toBeTruthy();

    // The following tests are disabled because the added tokens need a refresh to show up. Fix FE-1122 and enable these.

    // await page.waitForTimeout(1000);
    // await page.reload({ waitUntil: 'domcontentloaded' });
    // await page.waitForTimeout(1000);
    // // Non-verified asset that was added to asset list will never be inside of "Hidden assets" part
    // // The TKN2 asset should not be in the hidden assets list
    // const h6Texts = await page.$$eval('div.fuel_CardList h6', (els) =>
    //   els.map((el) => el.textContent?.trim())
    // );
    // await page.getByRole('button', { name: 'Show unknown assets' }).click();
    // await page.waitForTimeout(1000);
    // const h6TextsAfter = await page.$$eval('div.fuel_CardList h6', (els) =>
    //   els.map((el) => el.textContent?.trim())
    // );
    // const diff = h6TextsAfter.filter((el) => !h6Texts.includes(el));
    // console.log(diff);
    // // expect at least one of the elements in diff to be Token 2
    // expect(diff.some((el) => el === 'Token 2')).toBeTruthy();
  });
});
