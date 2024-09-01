import { Provider, bn } from 'fuels';
import { mockServer } from '~/mocks/server';
import {
  MOCK_BASE_ASSET_ID,
  mockBalancesOnGraphQL,
} from '~/systems/Asset/__mocks__/assets';

import { MOCK_ACCOUNTS } from '../__mocks__';

import { graphql } from 'msw';
import { AccountService } from './account';

const _providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;
const MOCK_ACCOUNT = MOCK_ACCOUNTS[0];

const MOCK_BALANCES = [
  {
    node: {
      assetId: MOCK_BASE_ASSET_ID,
      amount: bn(1000),
    },
  },
];

mockServer([mockBalancesOnGraphQL(MOCK_BALANCES)]);

describe('AccountService', () => {
  beforeEach(async () => {
    await AccountService.clearAccounts();
  });

  it('should add a new account', async () => {
    const accounts = await AccountService.getAccounts();
    expect(accounts.length).toBe(0);
    await AccountService.addAccount({ data: MOCK_ACCOUNT });
    expect((await AccountService.getAccounts()).length).toBe(1);
  });

  it('should convert an array of accounts into a map', async () => {
    expect(AccountService.toMap([MOCK_ACCOUNT])).toEqual({
      [MOCK_ACCOUNT.address]: MOCK_ACCOUNT,
    });
  });

  it('should convert a map of accounts into an array', async () => {
    expect(
      AccountService.fromMap({ [MOCK_ACCOUNT.address]: MOCK_ACCOUNT })
    ).toEqual([MOCK_ACCOUNT]);
  });
});
