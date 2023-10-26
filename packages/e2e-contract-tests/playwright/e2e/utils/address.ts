import { shortAddress } from '@fuel-wallet/test-utils/src/utils';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Bech32Address } from 'fuels';

export const checkAddresses = async (
  fromAddress: Bech32Address,
  toAddress: Bech32Address,
  page: Page,
  position: number = 0
) => {
  const fromArticle = page.getByRole('article').getByText('From').nth(position);
  await expect(fromArticle).toHaveText(shortAddress(fromAddress.toString()), {
    useInnerText: true,
  });
  const toArticle = page.getByRole('article').getByText('To').nth(position);
  await expect(toArticle).toHaveText(shortAddress(toAddress.toString()), {
    useInnerText: true,
  });
};
