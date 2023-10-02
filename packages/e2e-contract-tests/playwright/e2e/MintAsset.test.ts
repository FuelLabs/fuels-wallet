import {
  test,
  walletSetup,
  getButtonByText,
  getWalletPage,
  hasText,
} from '@fuel-wallet/test-utils';
import { shortAddress, calculateAssetId } from '../../src/utils';
import '../../load.envs.js';

test.describe('Mint Assets', () => {
  test.beforeEach(async ({ context, extensionId, page }) => {
    await walletSetup(context, extensionId, page);
    await page.goto('/');
  });

  test('e2e mint assets', async ({ context, page }) => {
    const connectButton = getButtonByText(page, 'Connect');
    await connectButton.click();

    const mintAmount = '1.2345';
    const mintInput = page.getByLabel('Mint asset card').locator('input');
    await mintInput.fill(mintAmount);

    const mintButton = getButtonByText(page, 'Mint');
    await mintButton.click();

    const assetId = calculateAssetId(process.env.VITE_MINT_CONTRACT_ID!);
    const walletPage = await getWalletPage(context);
    // short address function copied from app package
    await hasText(walletPage, shortAddress(assetId));
  });
});
