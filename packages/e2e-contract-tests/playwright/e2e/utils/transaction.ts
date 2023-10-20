import { getByAriaLabel } from '@fuel-wallet/test-utils';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const checkFee = async (page: Page, feeExpected: string) => {
  const fee = getByAriaLabel(page, 'Fee Value');
  const feeText = await fee.innerText();
  expect(feeText).toEqual(feeExpected);
};
