import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Address } from 'fuels';

import { shortAddress } from '../../../src/utils';

export const checkAddresses = async (
  from: { address: string; isContract: boolean },
  to: { address: string; isContract: boolean },
  page: Page,
  fromPosition = 0,
  toPosition = 0
) => {
  const fromArticle = page.getByLabel('From address').nth(fromPosition);

  const fromShortAddress = shortAddress(from.address);

  // from address text is fromArticle > div > div > p
  const fromAddressText = fromArticle.locator('div').locator('p');
  await expect(fromAddressText).toHaveText(fromShortAddress, {
    useInnerText: true,
  });

  const toArticle = page.getByLabel('To address').nth(toPosition);
  const toShortAddress = shortAddress(to.address);
  const toAddressText = toArticle.locator('div').locator('p');
  await expect(toAddressText).toHaveText(toShortAddress, {
    useInnerText: true,
  });
};
