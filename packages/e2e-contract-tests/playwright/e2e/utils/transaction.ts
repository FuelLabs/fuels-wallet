import { getByAriaLabel, hasText } from '@fuels/playwright-utils';
import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { BN } from 'fuels';
import { bn } from 'fuels';

export const checkFee = async (
  page: Page,
  { minFee, maxFee }: { minFee: BN; maxFee: BN }
) => {
  const fee = getByAriaLabel(page, 'Fee Value');
  const feeText = (await fee.innerText()).replace(' ETH', '');
  expect(bn.parseUnits(feeText).gte(minFee)).toBeTruthy();
  expect(bn.parseUnits(feeText).lte(maxFee)).toBeTruthy();
};

export const waitSuccessTransaction = async (page: Page) => {
  await expect
    .poll(
      () =>
        hasText(page, 'Transaction successful.')
          .then(() => true)
          .catch(() => false),
      { timeout: 15000 }
    )
    .toBeTruthy();
};

export async function waitForWalletNotification(
  fuelWalletTestHelper: FuelWalletTestHelper
): Promise<Page> {
  console.log('🔍 Getting wallet notification page...');
  let walletNotificationPage: Page | null = null;
  await expect
    .poll(
      async () => {
        try {
          walletNotificationPage =
            await fuelWalletTestHelper.getWalletPopupPage();
          return true;
        } catch {
          return false;
        }
      },
      { timeout: 30000, intervals: [5000] }
    )
    .toBeTruthy();

  if (!walletNotificationPage) {
    throw new Error('Failed to get wallet notification page');
  }
  console.log('✅ Wallet notification page ready');
  return walletNotificationPage;
}
