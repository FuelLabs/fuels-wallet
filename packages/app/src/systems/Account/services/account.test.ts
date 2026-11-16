import { bn } from 'fuels';
import { MOCK_BASE_ASSET_ID } from '~/systems/Asset/__mocks__/assets';

import { MOCK_ACCOUNTS } from '../__mocks__';

import { AccountService, sortByRecentUse } from './account';

const _providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;
const MOCK_ACCOUNT = MOCK_ACCOUNTS[0];

const _MOCK_BALANCES = [
  {
    node: {
      assetId: MOCK_BASE_ASSET_ID,
      amount: bn(1000),
    },
  },
];

// mockServer([mockBalancesOnGraphQL(MOCK_BALANCES)]);

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

  it('should order accounts by most recent use, current first', () => {
    const base = { address: '', publicKey: '' };
    const accounts = [
      { ...base, name: 'Account 10' },
      { ...base, name: 'Account 2' },
      { ...base, name: 'Account 3', lastUsedAt: 100 },
      { ...base, name: 'Account 4', lastUsedAt: 300 },
      { ...base, name: 'Account 5', isCurrent: true, lastUsedAt: 200 },
    ];
    expect(sortByRecentUse(accounts).map((a) => a.name)).toEqual([
      'Account 5',
      'Account 4',
      'Account 3',
      'Account 2',
      'Account 10',
    ]);
  });

  it('should move an account to the top once it is made current', async () => {
    await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
    await AccountService.addAccount({ data: MOCK_ACCOUNTS[1] });
    await AccountService.setCurrentAccount({
      address: MOCK_ACCOUNTS[1].address,
    });
    const [first] = await AccountService.getAccounts();
    expect(first.address).toBe(MOCK_ACCOUNTS[1].address);
    expect(first.lastUsedAt).toEqual(expect.any(Number));
  });
});
