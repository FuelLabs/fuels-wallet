import { getByAriaLabel, hasText } from '@fuels/playwright-utils';
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
  await hasText(page, 'Transaction successful.', 0, 15000);
};
