import { bn } from 'fuels';
import { graphql } from 'msw';

import { AccountService } from './account';

import { mockServer } from '~/mocks/server';
import { ASSET_LIST } from '~/systems/Asset';

const MOCK_ACCOUNT = {
  name: 'Account 1',
  address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef',
  publicKey: '0x00',
};

const MOCK_BALANCES = [
  {
    node: {
      assetId: ASSET_LIST[0].assetId,
      amount: bn(1000),
    },
  },
];

mockServer([
  graphql.query('getBalances', (_req, res, ctx) => {
    return res(ctx.data({ balances: { edges: MOCK_BALANCES } }));
  }),
]);

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

  it('should fetch balance from account', async () => {
    const account = await AccountService.addAccount({ data: MOCK_ACCOUNT });
    if (!account) return;
    const result = await AccountService.fetchBalance({ account });
    expect(result.balance).toBe(bn(1000).toString());
    expect(result.address).toBe(MOCK_ACCOUNT.address);
    expect(result.balances?.[0].assetId).toBe(ASSET_LIST[0].assetId);
  });

  it('should convert an array of accounts into a map', async () => {
    expect(AccountService.toMap([MOCK_ACCOUNT])).toEqual({
      [MOCK_ACCOUNT.address]: MOCK_ACCOUNT,
    });
  });

  it('should convert a map of accounts into an array', async () => {
    expect(AccountService.fromMap({ [MOCK_ACCOUNT.address]: MOCK_ACCOUNT })).toEqual([
      MOCK_ACCOUNT,
    ]);
  });
});
