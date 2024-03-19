import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Bech32Address } from 'fuels';

import { shortAddress } from '../../../src/utils';

export const checkAddresses = async (
  from: { address: Bech32Address; isContract: boolean },
  to: { address: Bech32Address; isContract: boolean },
  page: Page,
  fromPosition = 0,
  toPosition = 0
) => {
  const fromArticle = page
    .getByRole('article')
    .filter({
      has: page
        .getByRole('paragraph')
        .getByText(`From${from.isContract ? ' (Contract)' : ''}`, {
          exact: true,
        }),
      hasNotText: 'To',
    })
    .nth(fromPosition);
  const fromShortAddress = shortAddress(from.address.toString());
  const fromAddressText = fromArticle
    .getByRole('paragraph')
    .getByText(fromShortAddress, { exact: true });
  await expect(fromAddressText).toHaveText(fromShortAddress, {
    useInnerText: true,
  });

  const toArticle = page
    .getByRole('article')
    .filter({
      has: page
        .getByRole('paragraph')
        .getByText(`To${to.isContract ? ' (Contract)' : ''}`, {
          exact: true,
        }),
      hasNotText: 'From',
    })
    .nth(toPosition);
  const toShortAddress = shortAddress(to.address.toString());
  const toAddressText = toArticle
    .getByRole('paragraph')
    .getByText(toShortAddress, { exact: true });
  await expect(toAddressText).toHaveText(toShortAddress, {
    useInnerText: true,
  });
};
