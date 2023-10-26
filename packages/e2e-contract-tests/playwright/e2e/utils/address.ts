import { shortAddress } from '@fuel-wallet/test-utils/src/utils';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Bech32Address } from 'fuels';

export const checkAddresses = async (
  from: { address: Bech32Address; isContract: boolean },
  to: { address: Bech32Address; isContract: boolean },
  page: Page,
  fromPosition: number = 0,
  toPosition: number = 0
) => {
  const fromArticle = page
    .getByRole('article')
    .filter({
      has: page
        .getByRole('paragraph')
        .getByText(`From${from.isContract ? ' (Contract)' : ''}`, {
          exact: true,
        }),
    }).nth(fromPosition);
    console.log(`fromArticle`, await fromArticle.innerText());
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
    }).nth(toPosition);
  console.log("toArticle: ", await toArticle.innerText());
  const toShortAddress = shortAddress(to.address.toString());
  const toAddressText = toArticle
    .getByRole('paragraph')
    .getByText(toShortAddress, { exact: true });
  await expect(toAddressText).toHaveText(toShortAddress, {
    useInnerText: true,
  });
};
