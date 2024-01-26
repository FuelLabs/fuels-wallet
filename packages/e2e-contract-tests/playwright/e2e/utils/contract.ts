import type { FuelWalletTestHelper } from '@fuel-wallet/playwright-utils';
import { getButtonByText, getByAriaLabel } from '@fuel-wallet/playwright-utils';
import type { Page } from '@playwright/test';

export const connect = async (
  page: Page,
  fuelWalletTestHelper: FuelWalletTestHelper,
  walletName: string = 'Fuel Wallet'
) => {
  const connectButton = getButtonByText(page, 'Connect');
  await connectButton.click();
  await getByAriaLabel(page, `Connect to ${walletName}`, true).click();
  await fuelWalletTestHelper.walletConnect();
};
