import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';
import { useAccounts } from '../../hooks';

import { AccountItem } from './AccountItem';

describe('AccountItem', () => {
  const { handlers } = useAccounts();

  it('a11y', async () => {
    await testA11y(
      <AccountItem
        account={MOCK_ACCOUNTS[0]}
        onPress={() => handlers.selectAccount(MOCK_ACCOUNTS[0])}
      />
    );
  });

  it('should show a name and as abbreviated address', async () => {
    render(
      <AccountItem
        account={MOCK_ACCOUNTS[0]}
        onPress={() => handlers.selectAccount(MOCK_ACCOUNTS[0])}
      />
    );
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('fuel0x...74ef')).toBeInTheDocument();
  });

  it('should return null when isHidden', async () => {
    render(
      <AccountItem
        account={MOCK_ACCOUNTS[0]}
        isHidden
        onPress={() => handlers.selectAccount(MOCK_ACCOUNTS[0])}
      />
    );
    expect(() => screen.getByText('Account 1')).toThrow();
    expect(() => screen.getByText('fuel0x...74ef')).toThrow();
  });
});
