import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { getButtonByText } from '@fuel-wallet/playwright-utils';
import type { Page } from '@playwright/test';

export const connect = async (
  page: Page,
  fuelWalletTestHelper: FuelWalletTestHelper
) => {
  const connectButton = getButtonByText(page, 'Connect');
  await connectButton.click();
  await fuelWalletTestHelper.walletConnect();
};
