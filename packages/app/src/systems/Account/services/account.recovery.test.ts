import { db } from '~/systems/Core/utils/database';
import { MOCK_ACCOUNTS } from '../__mocks__';
import { AccountService } from './account';

const duplicateAccounts = [
  { ...MOCK_ACCOUNTS[0], name: 'SameName' },
  { ...MOCK_ACCOUNTS[1], name: 'SameName' },
];

// Mock dependencies
jest.mock('~/systems/Core/services/chromeStorage', () => ({
  chromeStorage: {
    accounts: {
      getAll: jest.fn(),
    },
    vaults: {
      getAll: jest.fn().mockResolvedValue([]),
    },
    networks: {
      getAll: jest.fn().mockResolvedValue([]),
    },
  },
}));

jest.mock('~/systems/Core/utils/opfs', () => ({
  readFromOPFS: jest.fn().mockResolvedValue({}),
  saveToOPFS: jest.fn(),
}));

describe('AccountService Reproduction', () => {
  beforeEach(async () => {
    await AccountService.clearAccounts();
  });

  it('should handle duplicate account names during recovery without crashing', async () => {
    const { chromeStorage } = require('~/systems/Core/services/chromeStorage');
    // Wrap the duplicate accounts in { key, data } structure as expected by chromeStorage
    // Looking at account.ts: chromeStorage.accounts.getAll() returns items, and recoverAccounts uses item.data
    // Wait, let's check account.ts logic.
    // chromeStorageBackupData.accounts.map(account => account.data)

    const mockStorageData = duplicateAccounts.map((acc) => ({
      key: acc.address,
      data: acc,
    }));

    chromeStorage.accounts.getAll.mockResolvedValue(mockStorageData);

    // This should NOT throw after fix. Before fix, it might throw ConstraintError.
    await AccountService.recoverWallet();

    const accounts = await AccountService.getAccounts();
    // After fix, we expect both accounts to be saved (one renamed).
    expect(accounts.length).toBe(2);
    const original = accounts.find((a) => a.name === 'SameName');
    const renamed = accounts.find((a) => a.name.startsWith('SameName 0x'));
    expect(original).toBeDefined();
    expect(renamed).toBeDefined();
  });
});
