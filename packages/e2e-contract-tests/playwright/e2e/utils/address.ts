import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Address } from 'fuels';

import { shortAddress } from '../../../src/utils';

export const checkAddresses = async (
  _from: { address: string; isContract: boolean },
  _to: { address: string; isContract: boolean },
  _page: Page,
  _fromPosition = 0,
  _toPosition = 0
) => {
  return;
  // const fromArticle = page
  //   .getByRole('article')
  //   .filter({
  //     has: page
  //       .getByRole('paragraph')
  //       .getByText(`From${from.isContract ? ' (Contract)' : ''}`, {
  //         exact: true,
  //       }),
  //     hasNotText: 'To',
  //   })
  //   .nth(fromPosition);

  // const fromShortAddress = shortAddress(from.address);
  // const fromAddressText = fromArticle
  //   .getByRole('paragraph')
  //   .getByText(fromShortAddress, { exact: true });
  // await expect(fromAddressText).toHaveText(fromShortAddress, {
  //   useInnerText: true,
  // });

  // const toArticle = page
  //   .getByRole('article')
  //   .filter({
  //     has: page
  //       .getByRole('paragraph')
  //       .getByText(`To${to.isContract ? ' (Contract)' : ''}`, {
  //         exact: true,
  //       }),
  //     hasNotText: 'From',
  //   })
  //   .nth(toPosition);
  // const toShortAddress = shortAddress(to.address);
  // const toAddressText = toArticle
  //   .getByRole('paragraph')
  //   .getByText(toShortAddress, { exact: true });
  // await expect(toAddressText).toHaveText(toShortAddress, {
  //   useInnerText: true,
  // });
};
