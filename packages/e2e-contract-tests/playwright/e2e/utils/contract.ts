import type { FuelWalletTestHelper } from '@fuels/playwright-utils';
import { getButtonByText, getByAriaLabel } from '@fuels/playwright-utils';
import type { Page } from '@playwright/test';

export const connect = async (
  page: Page,
  fuelWalletTestHelper: FuelWalletTestHelper,
  walletName = 'Fuel Wallet Development'
) => {
  const connectButton = getButtonByText(page, 'Connect');
  await connectButton.click();
  await getByAriaLabel(page, `Connect to ${walletName}`, true).click();
  await fuelWalletTestHelper.walletConnect();

  await page.waitForTimeout(3000);
};
